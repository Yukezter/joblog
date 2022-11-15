import { Twilio } from 'twilio'
import clientPromise from '../utils/mongodb'

export default class PhoneService {
  static client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

  static async getDB(dbName = 'joblog') {
    const client = await clientPromise
    return client.db(dbName)
  }

  static async sendTextMessage(to: string, body: string) {
    this.client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    })
  }

  static async sendVerificationCode(to: string) {
    const serviceContext = this.client.verify.services(process.env.TWILIO_SERVICE_SID)
    await serviceContext.verifications.create({ to, channel: 'sms' })
  }

  static async checkVerification(to: string, code: string) {
    const serviceContext = this.client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    const response = await serviceContext.verificationChecks.create({ to, code })

    if (response.status !== 'approved') {
      throw new Error('Phone verification failed.')
    }
  }
}
