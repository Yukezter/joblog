import type { NextApiRequest, NextApiResponse } from 'next'
import { FindOptions } from 'mongodb'
import { JobApplication, jobTypes, jobLocationTypes, applicationStatuses } from '../../../types.d'
import getServerSession from '../../../utils/getServerSession'
import { getApplications } from '../../../services/applications'

export type Data = Awaited<ReturnType<typeof getApplications>>

export const sortByOptions: readonly (keyof Pick<
  JobApplication,
  'dateApplied' | 'companyName' | 'jobTitle' | 'applicationStatus'
>)[] = ['dateApplied', 'companyName', 'jobTitle', 'applicationStatus'] as const

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  console.log(req.query)
  const { user } = session
  const { jobTitle, jobType, jobLocationType, applicationStatus, dateApplied, sortBy } = req.query

  // Query filters
  const filter: Parameters<typeof getApplications>[0] = { user_id: user.id }

  // if (typeof jobTitle === 'string') {
  //   filter.jobTitle = jobTitle
  // }

  if (jobTypes.some(v => v === jobType)) {
    filter.jobType = jobType as typeof jobTypes[number]
  }

  if (jobLocationTypes.some(v => v === jobLocationType)) {
    filter.jobLocationType = jobLocationType as typeof jobLocationTypes[number]
  }

  if (applicationStatuses.some(v => v === applicationStatus)) {
    filter.applicationStatus = applicationStatus as typeof applicationStatuses[number]
  }

  if (dateApplied && typeof dateApplied === 'string') {
    if (dateApplied === '30d') {
      filter.dateApplied = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() }
    }

    if (dateApplied === '90d') {
      filter.dateApplied = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime() }
    }
  }

  // Query options (sorting)
  const sortByKey = sortByOptions.find(v => v === sortBy) ?? 'dateApplied'

  const options: FindOptions = {
    sort: { [sortByKey]: 1 },
  }

  const applications = await getApplications(filter, options)

  if (!applications) {
    return res.status(404).end()
  }

  res.status(200).json(applications)
}
