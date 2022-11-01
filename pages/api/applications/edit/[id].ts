import type { NextApiRequest, NextApiResponse } from 'next'
import { JobApplication } from '../../../../types'
import getServerSession from '../../../../utils/getServerSession'
import { editApplication } from '../../../../services/applications'

export type Data = JobApplication

export default async function handler(req: NextApiRequest, res: NextApiResponse<void>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { id } = req.query
  const { user } = session
  const data = req.body as Data

  if (typeof id !== 'string') {
    return res.status(404).end()
  }

  await editApplication({ _id: id, user_id: user.id }, data)

  res.status(200).end()
}
