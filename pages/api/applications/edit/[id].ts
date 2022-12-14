import type { NextApiRequest, NextApiResponse } from 'next'
import { JobApplication } from '../../../../types'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

export type Body = JobApplication
export type Data = Awaited<ReturnType<typeof DbService['editApplication']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(404).end()
  }

  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const body = req.body as Body

  const data = await DbService.editApplication({ id, userId: user.id }, body)
  res.json(data)
}
