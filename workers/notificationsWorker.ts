import DbService from '../services/db'
import PhoneService from '../services/phone'
import events from '../events'

const sendNotifications = async () => {
  try {
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
          const checkReminderTime = async (timeBefore: 'week' | 'day' | 'hour') => {
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

              events.notifications.emit(user.id, notification)

              PhoneService.sendTextMessage(
                user.phoneNumber!,
                `Hi there! Just a friendly reminder that you have an interview in 1 ${timeBefore} with ${application.companyName}.`
              )

              console.log(nowMin, notificationTimeMin)
            }
          }

          if (user.notifications.weekBefore) {
            checkReminderTime('week')
          } else if (user.notifications.dayBefore) {
            checkReminderTime('day')
          } else if (user.notifications.hourBefore) {
            checkReminderTime('hour')
          }
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const notificationsWorker = {
  run: () => {
    sendNotifications()
  },
}

export default notificationsWorker
