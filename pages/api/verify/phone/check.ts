import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import DbService from '../../../../services/db'
import PhoneService from '../../../../services/phone'

type Body = {
  to: string
  code: string
}

export type Data = Awaited<ReturnType<typeof PhoneService['checkVerification']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  try {
    const { user } = session
    const { to: phoneNumber, code } = req.body as Body
    await PhoneService.checkVerification(phoneNumber, code)
    await DbService.updateUser(user.id, { phoneNumber })

    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(400).end()
  }
}
