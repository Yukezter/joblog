import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

export type Data = NonNullable<Awaited<ReturnType<typeof DbService['readNotifications']>>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const body = req.body as string[]
  await DbService.readNotifications(user.id, body)

  res.status(200).end()
}
