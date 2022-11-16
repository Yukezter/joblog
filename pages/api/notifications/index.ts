import type { NextApiRequest, NextApiResponse } from 'next'
import getServerSession from '../../../utils/getServerSession'
import events from '../../../events'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res)

  if (!session || !session.user) {
    return res.status(401).end()
  }

  if (req.method === 'GET') {
    res
      .writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream',
      })
      .flushHeaders()

    const { user } = session
    events.notifications.on(user.id, data => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    })

    res.on('close', () => {
      res.end()
    })
  } else {
    res.status(400).end()
  }
}
