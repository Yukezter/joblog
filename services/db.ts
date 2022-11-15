import { ObjectId, Filter } from 'mongodb'
import { Session } from 'next-auth'
import type { JobApplication, UserNotification, UserSettings } from '../types'
import clientPromise from '../utils/mongodb'

type User = NonNullable<Session['user']>

// type Options = {

// }

const addIdFieldStage = {
  $addFields: {
    id: { $toString: '$_id' },
  },
}

const projectWithout_IdStage = {
  $project: {
    _id: 0,
  },
}

export default class DbService {
  static async getDB(dbName = 'joblog') {
    const client = await clientPromise
    return client.db(dbName)
  }

  static async getUsersWithNotificationsOn() {
    const db = await this.getDB()
    const users = db.collection<User>('users')
    const result = await users
      .aggregate<User>([
        {
          $match: {
            phoneNumber: { $exists: true },
            'notifications.on': true,
            $or: [
              { 'notifications.hourBefore': true },
              { 'notifications.dayBefore': true },
              { 'notifications.weekBefore': true },
            ],
          },
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result
  }

  static async updateUser(id: string, data: Partial<User>) {
    const db = await this.getDB()
    const users = db.collection<User>('users')
    await users.updateOne({ _id: new ObjectId(id) }, { $set: data })
  }

  static async deletePhoneNumber(id: string) {
    const db = await this.getDB()
    const users = db.collection<User>('users')
    await users.updateOne({ _id: new ObjectId(id) }, { $unset: { phoneNumber: '' } })
  }

  static async getUserSettings(id: string) {
    const db = await this.getDB()
    const settings = db.collection<UserSettings>('user_settings')
    const result = await settings
      .aggregate<UserSettings>([
        { $match: { _id: new ObjectId(id) } },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result.length ? result[0] : null
  }

  static async updateUserSettings(id: string, data: Partial<UserSettings>) {
    const db = await this.getDB()
    const users = db.collection<UserSettings>('users')
    const result = await users.findOneAndUpdate({ _id: new ObjectId(id) }, [
      { $set: data },
      addIdFieldStage,
      projectWithout_IdStage,
    ])

    return result.value as UserSettings
  }

  static async createNotification(data: Omit<UserNotification, 'id'>) {
    const db = await this.getDB()
    const notifications = db.collection<typeof data>('notifications')
    await notifications.insertOne(data)
  }

  static async getApplication({ id, userId }: Partial<JobApplication>) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications
      .aggregate<JobApplication>([
        {
          $match: {
            _id: new ObjectId(id),
            userId,
          },
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result.length ? result[0] : null
  }

  static async getApplications(filter: Partial<JobApplication> = {}) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications
      .aggregate<JobApplication>([
        {
          $match: filter,
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result
  }

  static async getProjectedApplications(
    filter: Partial<JobApplication> = {},
    options: {
      fromDate?: number
      sortBy?: keyof JobApplication
    } = {}
  ) {
    const { fromDate, sortBy = 'dateApplied' } = options

    const _filter: Filter<JobApplication> = { ...filter }

    if (fromDate) {
      _filter.dateApplied = { $gt: fromDate }
    }

    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications
      .aggregate<
        Pick<
          JobApplication,
          | 'id'
          | 'userId'
          | 'companyName'
          | 'jobTitle'
          | 'jobLocationType'
          | 'jobType'
          | 'pay'
          | 'dateApplied'
          | 'applicationStatus'
          | 'interviewDate'
        >
      >([
        {
          $match: _filter,
        },
        addIdFieldStage,
        {
          $project: {
            _id: 0,
            id: 1,
            userId: 1,
            companyName: 1,
            jobTitle: 1,
            jobLocationType: 1,
            jobType: 1,
            pay: 1,
            dateApplied: 1,
            applicationStatus: 1,
            interviewDate: 1,
          },
        },
        { $sort: { [sortBy]: 1 } },
      ])
      .toArray()

    return result
  }

  static async getApplicationsWithFutureInterviewsByUserIds(userIds: string[], now: number) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications
      .aggregate<JobApplication>([
        {
          $match: {
            userId: { $in: userIds },
            interviewDate: { $ne: null, $gt: now },
          },
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result
  }

  static async getApplicationFormOptions(userId: string) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const jobTitles = await applications.distinct('jobTitle', { userId })
    const jobBoards = await applications.distinct('jobBoard', { userId })
    const peoplePositions = await applications.distinct('notablePeople.position', { userId })

    const result = {
      jobTitles: jobTitles.map(value => ({ value })),
      jobBoards: jobBoards.map(value => ({ value })),
      peoplePositions: peoplePositions.map(value => ({ value })),
    }

    // const cursor = applications.aggregate([
    //   { $match: { userId } },
    //   // { $unwind: '$notablePeople' },
    //   {
    //     $group: {
    //       _id: null,
    //       jobTitle: { $addToSet: '$jobTitle' },
    //       jobBoard: { $addToSet: '$jobBoard' },
    //       positions: { $addToSet: '$notablePeople.position' },
    //     },
    //   },
    // ])

    return result
  }

  static async createApplication(data: Omit<JobApplication, 'id'>) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications.findOneAndUpdate(
      { _id: new ObjectId() },
      [{ $setOnInsert: data }, addIdFieldStage, projectWithout_IdStage],
      { upsert: true, returnDocument: 'after' }
    )

    return result.value as JobApplication
  }

  static async editApplication(
    { id, userId }: Pick<JobApplication, 'id' | 'userId'>,
    data: Partial<JobApplication>
  ) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications.findOneAndUpdate({ _id: new ObjectId(id), userId }, [
      { $set: data },
      addIdFieldStage,
      projectWithout_IdStage,
    ])

    return result.value as JobApplication
  }
}
