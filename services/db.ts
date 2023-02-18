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
  static async client(dbName = 'joblog') {
    const client = await clientPromise
    return client.db(dbName)
  }

  static async getDB(dbName = 'joblog') {
    const client = await clientPromise
    return client.db(dbName)
  }

  static async updateUser(id: string, data: Partial<User>) {
    const db = await this.getDB()
    const users = db.collection<User>('users')
    await users.updateOne({ _id: new ObjectId(id) }, { $set: data })
  }

  static async deletePhoneNumber(id: string) {
    const db = await this.getDB()
    const users = db.collection<UserSettings>('settings')
    await users.updateOne({ _id: new ObjectId(id) }, { $set: { phoneNumber: null } })
  }

  static async getUserSettings(id: string) {
    const db = await this.getDB()
    const settings = db.collection<UserSettings>('settings')
    const result = await settings
      .aggregate<UserSettings>([
        { 
          $match: {
            _id: Array.isArray(id) ? { $in: id } : new ObjectId(id)
          }
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result.length ? result[0] : null
  }

  static async getManyUserSettings(ids: string[]) {
    const db = await this.getDB()
    const settings = db.collection<UserSettings>('settings')
    const result = await settings
      .aggregate<UserSettings>([
        { 
          $match: {
            _id: { $in: ids }
          }
        },
        addIdFieldStage,
        projectWithout_IdStage,
      ])
      .toArray()

    return result
  }

  static async updateUserSettings(id: string, data: Partial<UserSettings>) {
    const db = await this.getDB()
    const users = db.collection<UserSettings>('settings')
    await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    )
  }

  static async createNotification(userId: string, data: Omit<UserNotification, 'id'>) {
    const db = await this.getDB()
    const notifications = db.collection<typeof data & { userId: string }>('notifications')
    await notifications.insertOne({ userId, ...data })
  }

  static async getNotifications(id: string) {
    const db = await this.getDB()
    const notifications = db.collection<UserNotification>('notifications')
    return notifications.aggregate(
      [
        { $match: { userId: id } },
        addIdFieldStage,
        projectWithout_IdStage,
        { $sort: { createdAt: -1 } }
      ]
    ).toArray()
  }

  static async readNotifications(userId: string, ids: string[]) {
    const db = await this.getDB()
    const notifications = db.collection<UserNotification>('notifications')
    await notifications.updateMany(
      { _id: { $in: ids.map(id => new ObjectId(id)) }, userId },
      { $set: { seen: true } }
    )
  }

  static async clearNotifications(userId: string) {
    const db = await this.getDB()
    const notifications = db.collection<UserNotification>('notifications')
    await notifications.deleteMany({ userId })
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

  static async getApplicationsWithInterviews(now: number) {
    const db = await this.getDB()
    const applications = db.collection<JobApplication>('applications')
    const result = await applications
      .aggregate<JobApplication>([
        {
          $match: {
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
    const applications = db.collection<Omit<JobApplication, 'id'>>('applications')
    const result = await applications.insertOne(data)
    return result.insertedId.toString()
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
