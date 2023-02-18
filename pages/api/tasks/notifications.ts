import type { NextApiRequest, NextApiResponse } from 'next'
// import getServerSession from '../../../utils/getServerSession'
import db from '../../../services/db'
import PhoneService from '../../../services/phone'
import SocketService from '../../../services/socket'
import { UserSettings, JobApplication } from '../../../types'
import { INTERVIEW_REMINDER_TIMES } from '../../../utils/constants'

type Minutes = keyof typeof INTERVIEW_REMINDER_TIMES

type UserWithApplications = UserSettings & {
  applications: (Omit<JobApplication, 'interviewDate'> & {
    interviewDate: number
  })[]
}

const mockNotifications = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getServerSession(req, res)
  const date = new Date()
  const end = date.getTime()
  date.setFullYear(2022, 11, 1)
  const start = date.getTime()
  // Get a random time between now and Dec 1st, 2022
  const getRandomTime = () => start + (Math.round(Math.random() * (end - start)))
  const notifications = Array.from(Array(5)).map(() => ({
    title: 'Notification',
    message: 'Your interview with Microsoft in 5 minutes.',
    seen: false,
    createdAt: getRandomTime(),
    userId: '63e982ae626fc577d0f8eaea',
  }))

  const cli = await db.client()
  await cli.collection('notifications').insertMany(notifications)
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Checking interview reminders...')

    if (process.env.MOCK_NOTIFICATIONS === 'true') {
      await mockNotifications(req, res)
      return res.status(200).end()
    }

    // console.log(req.headers)
    // const res = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
    //   params: {
    //     id_token: req.headers.authorization?.split(' ')[1],
    //   },
    // })

    // console.log(res.data)

    const nowMs = Date.now()
    const nowMin = Math.round(nowMs / 1000 / 60)
    const cli = await db.client()
    const users = await cli.collection('settings').aggregate([
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          phoneNumber: 1,
          textRemindersDisabled: 1,
        }
      },
      {
        $lookup: {
          from: 'applications',
          localField: 'id',
          foreignField: 'userId',
          pipeline: [
            {
              $match: {
                interviewDate: { $ne: null, $gt: nowMs },
                interviewReminders: { $ne: [] }
              }
            }
          ],
          as: 'applications'
        }
      },
    ]).toArray() as UserWithApplications[]

    const date = new Date()
    users.forEach(user => {
      user.applications.forEach(application => {
        application.interviewReminders.forEach(minutesBefore => {
          date.setTime(application.interviewDate)
          date.setMinutes(date.getMinutes() - minutesBefore)

          const notificationTimeMin = Math.round(date.getTime() / 1000 / 60)

          if (nowMin === notificationTimeMin) {
            const label = INTERVIEW_REMINDER_TIMES[minutesBefore as Minutes].toLowerCase()
            const notification = {
              title: 'Reminder',
              message: `Your interview with ${application.companyName} in ${label}.`,
              createdAt: nowMs,
              seen: false,
            }
            
            db.createNotification(user.id, notification)
              .then(() => {
                SocketService.sendNotificationToUser(user.id, notification)
                
                if (user.phoneNumber && !user.textRemindersDisabled) {
                  PhoneService.sendTextMessage(
                    user.phoneNumber,
                    `Hi there! Just a friendly reminder of your interview with ${application.companyName} in ${label}.`
                  )
                }
      
                console.log('NOTIFACTION REMINDER SENT')
                console.log(notification)
              })
              .catch(error => {
                console.log(error)
              })
          }
        })
      })
    })

    res.status(200).end()
  } catch (err) {
    res.status(500)
  }
}