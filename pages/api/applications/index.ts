import type { NextApiRequest, NextApiResponse } from 'next'
import { JobApplication } from '../../../types'
import { JOB_TYPES, JOB_LOCATION_TYPES, APPLICATION_STATUSES } from '../../../utils/constants'
import getServerSession from '../../../utils/getServerSession'
import DbService from '../../../services/db'

export type Data = Awaited<ReturnType<typeof DbService['getProjectedApplications']>>

export const sortByKeys: readonly (keyof Pick<
  JobApplication,
  'dateApplied' | 'companyName' | 'jobTitle' | 'applicationStatus'
>)[] = ['dateApplied', 'companyName', 'jobTitle', 'applicationStatus'] as const

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session

  const filter: Parameters<typeof DbService['getProjectedApplications']>[0] = {
    userId: user.id,
    jobType: JOB_TYPES.find(option => option === req.query.jobType),
    jobLocationType: JOB_LOCATION_TYPES.find(option => option === req.query.jobLocationType),
    applicationStatus: APPLICATION_STATUSES.find(option => option === req.query.applicationStatus),
  }

  const options: Parameters<typeof DbService['getProjectedApplications']>[1] = {
    sortBy: sortByKeys.find(option => option === req.query.sortBy),
  }

  const date = new Date()
  const now = date.getTime()

  if (req.query.dateApplied === '1w') {
    date.setDate(date.getDate() - 7)
  } else if (req.query.dateApplied === '1m') {
    date.setMonth(date.getMonth() - 1)
  } else if (req.query.dateApplied === '3m') {
    date.setMonth(date.getMonth() - 3)
  } else if (req.query.dateApplied === '6m') {
    date.setMonth(date.getMonth() - 6)
  } else if (req.query.dateApplied === '1y') {
    date.setFullYear(date.getFullYear() - 1)
  }

  if (now !== date.getTime()) {
    options.fromDate = date.getTime()
  }

  const data = await DbService.getProjectedApplications(filter, options)
  res.status(200).json(data)
}
