import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

export type Data = NonNullable<Awaited<ReturnType<typeof DbService['getNotifications']>>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const data = await DbService.getNotifications(user.id)
  res.json(data)
}
