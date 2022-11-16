import Pusher from 'pusher'
import { UserNotification } from '../types'

class SocketService {
  private static client = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'us3',
    // useTLS: true,
  })

  static authenticateUser(socketId: string, data: Pusher.UserChannelData) {
    return this.client.authenticateUser(socketId, data)
  }

  static sendNotificationToUser(userId: string, data: Omit<UserNotification, 'id'>) {
    return this.client.sendToUser(userId, 'notification', data)
  }
}

export default SocketService
