import type { NextApiRequest, NextApiResponse } from 'next'
import type { JobApplication } from '../../../types'
import getServerSession from '../../../utils/getServerSession'
import DbService from '../../../services/db'

export type Body = Omit<JobApplication, 'id' | 'userId'>
export type Data = Awaited<ReturnType<typeof DbService['createApplication']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const data = req.body as Body
  const result = await DbService.createApplication({
    ...data,
    userId: user.id,
  })

  res.json(result)
}
