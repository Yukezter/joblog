import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

export type Data = ReturnType<Awaited<typeof DbService['getApplicationFormOptions']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const result = await DbService.getApplicationFormOptions(user.id)

  res.json(result)
}
