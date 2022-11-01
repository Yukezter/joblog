import type { NextApiRequest, NextApiResponse } from 'next'
import type { JobApplication } from '../../../types'
import getServerSession from '../../../utils/getServerSession'
import { createApplication } from '../../../services/applications'

export type Data = JobApplication

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401)
  }

  const { user } = session
  const data = req.body as JobApplication
  await createApplication({ user_id: user.id, ...data })

  res.redirect(200, '/applications')
}
