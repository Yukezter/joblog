/* Environment variables */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      MONGODB_URI: string
      EMAIL_SERVER: string
      EMAIL_FROM: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      TWITTER_CLIENT_ID: string
      TWITTER_CLIENT_SECRET: string
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      TWILIO_SERVICE_SID: string
      TWILIO_PHONE_NUMBER: string
      PUSHER_APP_ID: string
      PUSHER_KEY: string
      PUSHER_SECRET: string
    }
  }
}

/* NextAuth */

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      phoneNumber?: string
      notifications: {
        on: boolean
        hourBefore: boolean
        dayBefore: boolean
        weekBefore: boolean
      }
    }
  }

  interface DefaultUser extends DefaultUser {
    phoneNumber?: string
    notifications: {
      on: boolean
      hourBefore: boolean
      dayBefore: boolean
      weekBefore: boolean
    }
  }
}

/* App */

export type UserNotification = {
  id: string
  title: string
  message: string
  seen: boolean
  createdAt: number
}

// User Settings

export type UserSettings = {
  id: string
  notifications: {
    on: boolean
    hourBefore: boolean
    dayBefore: boolean
    weekBefore: boolean
  }
}

// Job Application

export type JobApplication = {
  id: string
  userId: string
  companyName: string
  jobTitle: string
  jobLocationType: JobLocationType
  jobLocation: Place | null
  jobType: JobType
  pay: JobPay
  dateApplied: number
  jobBoard: string
  submissionMethod: SubmissionMethod
  applicationLink: string | null
  applicationStatus: ApplicationStatuses
  interviewDate: number | null
  notablePeople: Person[]
}

export type Place = Pick<
  google.maps.places.AutocompletePrediction,
  'place_id' | 'description' | 'structured_formatting'
>

export type Person = {
  position: string
  name: string
  email: string | null
  phoneNumber: string | null
}

export type JobType = typeof import('./utils/constants').JOB_TYPES[number]

export type JobLocationType = typeof import('./utils/constants').JOB_LOCATION_TYPES[number]

export type PayType = typeof import('./utils/constants').PAY_TYPES[number]

export type PayRate = typeof import('./utils/constants').PAY_RATES[number]

export type JobPay =
  | {
      rate: PayRate
      type: typeof import('./utils/constants').PAY_TYPES[0 | 1 | 2]
      amount1: number
    }
  | {
      rate: PayRate
      type: typeof import('./utils/constants').PAY_TYPES[3]
      amount1: number
      amount2: number
    }

export type ApplicationStatuses = typeof import('./utils/constants').APPLICATION_STATUSES[number]

export type SubmissionMethod = typeof import('./utils/constants').SUBMISSION_METHODS[number]
