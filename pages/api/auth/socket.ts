import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../utils/getServerSession'
import SocketService from '../../../services/socket'

type Body = {
  socket_id: string
}

type Data = ReturnType<typeof SocketService.authenticateUser>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res)

    if (!session || !session.user) {
      return res.status(401).end()
    }

    try {
      const { user } = session
      const { socket_id } = req.body as Body
      const data = SocketService.authenticateUser(socket_id, { id: user.id })

      res.status(200).json(data)
    } catch (err) {
      res.status(400).end()
    }
  } else {
    res.status(405).end('Method not allowed.')
  }
}
