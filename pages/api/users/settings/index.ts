import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

export type Data = Awaited<ReturnType<typeof DbService['getUserSettings']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const data = await DbService.getUserSettings(user.id)

  res.json(data)
}
