import type { NextApiRequest, NextApiResponse } from 'next'
import { JobApplicationResponse } from '../../../types'
import getServerSession from '../../../utils/getServerSession'
import { getApplication } from '../../../services/applications'

export type Data = JobApplicationResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JobApplicationResponse>
) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { id } = req.query
  const { user } = session

  if (typeof id !== 'string') {
    return res.status(404).end()
  }

  const application = await getApplication({ _id: id, user_id: user.id })

  if (!application) {
    return res.status(404).end()
  }

  res.status(200).json(application)
}
