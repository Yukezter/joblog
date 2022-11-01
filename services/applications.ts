import { ObjectId, Filter, FindOptions } from 'mongodb'
import type { JobApplicationResponse } from '../types'
import clientPromise from '../utils/mongodb'

export const getDB = async () => {
  const client = await clientPromise
  const db = client.db('joblog')
  return db
}

type FilterType = Filter<JobApplicationResponse> & { _id?: string }

export const getApplication = async ({ _id, user_id }: FilterType) => {
  const db = await getDB()
  const applications = db.collection<JobApplicationResponse>('applications')
  return applications.findOne({
    _id: new ObjectId(_id),
    user_id,
  })
}

export type PartialApplication = Pick<
  JobApplicationResponse,
  | 'user_id'
  | 'companyName'
  | 'jobTitle'
  | 'jobLocationType'
  | 'jobType'
  | 'pay'
  | 'dateApplied'
  | 'applicationStatus'
  | 'interviewDate'
>

export const getApplications = async (
  filter: Filter<PartialApplication>,
  options: FindOptions = {}
) => {
  const db = await getDB()
  const applications = db.collection<PartialApplication>('applications')
  const cursor = applications.find(filter, {
    projection: {
      _id: 1,
      user_id: 1,
      companyName: 1,
      jobTitle: 1,
      jobLocationType: 1,
      jobType: 1,
      pay: 1,
      dateApplied: 1,
      applicationStatus: 1,
      interviewDate: 1,
    },
    ...options,
  })

  const result = await cursor.toArray()
  return result
}

export type AutocompleteOptions = {
  jobTitles: { value: string }[]
  jobBoards: { value: string }[]
  peoplePositions: { value: string }[]
}

export const getAutcompleteOptions = async ({ user_id }: Filter<JobApplicationResponse>) => {
  const db = await getDB()
  const applications = db.collection<JobApplicationResponse>('applications')
  const jobTitles = await applications.distinct('jobTitle', { user_id })
  const jobBoards = await applications.distinct('jobBoard', { user_id })
  const peoplePositions = await applications.distinct('notablePeople.position', { user_id })

  const result: AutocompleteOptions = {
    jobTitles: jobTitles.map(value => ({ value })),
    jobBoards: jobBoards.map(value => ({ value })),
    peoplePositions: peoplePositions.map(value => ({ value })),
  }

  // const cursor = applications.aggregate([
  //   { $match: { user_id } },
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

  // const result = await cursor.toArray()
  return result
}

// type A<T> = Omit<FindOptions<JobApplicationResponse>, 'projection'> & {
//   projection?: T
// }

// export const getApplications = async <T extends Partial<JobApplicationResponse>>({ user_id }: FilterType, options: A<T> = {}): Promise<WithId<T>[]> => {
//   const db = await getDB()
//   const applications = db.collection<JobApplicationResponse>('applications')
//   const cursor = applications.find(
//     { user_id },
//     {
//       projection: {
//         _id: 1,
//         user_id: 1,
//         companyName: 1,
//         jobTitle: 1,
//         jobLocationType: 1,
//         jobType: 1,
//         pay: 1,
//         dateApplied: 1,
//         applicationStatus: 1,
//         interviewDate: 1,
//       },
//       ...options,
//     }
//   )

//   const result = await cursor.toArray()
//   return result
// }

export const createApplication = async (data: Omit<JobApplicationResponse, '_id'>) => {
  const db = await getDB()
  const applications = db.collection<Omit<JobApplicationResponse, '_id'>>('applications')
  return applications.insertOne({ ...data })
}

export const editApplication = async (
  { _id, user_id }: FilterType,
  data: Partial<JobApplicationResponse>
) => {
  const db = await getDB()
  const applications = db.collection<JobApplicationResponse>('applications')
  return applications.updateOne({ _id: new ObjectId(_id), user_id }, { $set: data })
}
