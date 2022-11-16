import { CronJob } from 'cron'
import notificationsWorker from './workers/notificationsWorker'

const scheduler = {
  start: () => {
    new CronJob(
      '00 * * * * *',
      () => {
        notificationsWorker.run()
      },
      null,
      true,
      ''
    )
  },
}

export default scheduler
