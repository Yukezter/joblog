import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../../utils/getServerSession'
import PhoneService from '../../../../services/phone'

type Body = {
  to: string
}

export type Data = Awaited<ReturnType<typeof PhoneService['sendVerificationCode']>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(200).end()
  }

  const { to } = req.body as Body
  await PhoneService.sendVerificationCode(to)

  res.status(200).end()
}
