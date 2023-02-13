import type { NextApiRequest, NextApiResponse } from 'next'
import { UserSettings } from '../../../../types'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'

type Body = Partial<UserSettings>

export type Data = Awaited<ReturnType<typeof DbService['updateUserSettings']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  const { user } = session
  const body = req.body as Body
  const settings = {
    textRemindersDisabled: body.textRemindersDisabled
  }
  
  const data = await DbService.updateUserSettings(user.id, settings)

  res.json(data)
}
