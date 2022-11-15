import type { NextApiRequest, NextApiResponse } from 'next'
import { JobApplication } from '../../../types'
import getServerSession from '../../../utils/getServerSession'
import DbService from '../../../services/db'

export type Data = JobApplication

export default async function handler(req: NextApiRequest, res: NextApiResponse<JobApplication>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { id } = req.query
  const { user } = session

  if (typeof id !== 'string') {
    return res.status(404).end()
  }

  const data = await DbService.getApplication({ id, userId: user.id })

  if (!data) {
    return res.status(404).end()
  }

  res.status(200).json(data)
}
