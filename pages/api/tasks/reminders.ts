import type { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'
import DbService from '../../../services/db'
import PhoneService from '../../../services/phone'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'us3',
  // useTLS: true,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // console.log(req.headers)
    // const res = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
    //   params: {
    //     id_token: req.headers.authorization?.split(' ')[1],
    //   },
    // })

    // console.log(res.data)

    const users = await DbService.getUsersWithNotificationsOn()

    if (users.length) {
      const userIds = users.map(({ id }) => id)
      const nowMs = Date.now()
      const nowMin = Math.round(nowMs / 1000 / 60)

      const applications = await DbService.getApplicationsWithFutureInterviewsByUserIds(
        userIds,
        nowMs
      )

      applications.forEach(application => {
        const user = users.find(({ id }) => id === application.userId)

        if (user) {
          const sendReminder = async (timeBefore: 'week' | 'day' | 'hour') => {
            let date = new Date(application.interviewDate!)
            if (timeBefore === 'week') {
              date.setDate(date.getDate() - 7)
            } else if (timeBefore === 'day') {
              date.setDate(date.getDate() - 1)
            } else {
              date.setHours(date.getHours() - 1)
            }

            const notificationTimeMin = Math.round(date.getTime() / 1000 / 60)
            if (nowMin === notificationTimeMin) {
              const notification = {
                title: 'Reminder',
                message: `Interview coming up in 1 ${timeBefore}`,
                createdAt: Date.now(),
                seen: false,
              }

              await DbService.createNotification(notification)

              PhoneService.sendTextMessage(
                user.phoneNumber!,
                `Hi there! Just a friendly reminder that you have an interview in 1 ${timeBefore} with ${application.companyName}.`
              )

              console.log(nowMin, notificationTimeMin)
            }
          }

          if (user.notifications.weekBefore) {
            sendReminder('week')
          }

          if (user.notifications.dayBefore) {
            sendReminder('day')
          }

          if (user.notifications.hourBefore) {
            sendReminder('hour')
          }
        }
      })
    }

    res.status(200).end()
  } catch (err) {
    res.status(500)
  }
}
