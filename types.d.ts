import type { DefaultUser } from 'next-auth'
import { WithId } from 'mongodb'

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string
    }
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    uid: string
  }
}

/* Job Application */

export const jobTypes = ['Full-time', 'Part-time', 'Temporary', 'Contract', 'Internship'] as const
export type JobType = typeof jobTypes[number]

export const jobLocationTypes = ['In-person', 'Remote', 'Hybrid'] as const
export type JobLocationType = jobLocationTypes[number]

export type Place = Pick<
  google.maps.places.AutocompletePrediction,
  'place_id' | 'description' | 'structured_formatting'
>

const payTypes = ['min', 'max', 'exact', 'range'] as const
export type PayType = typeof payTypes[number]

export const payRates = ['hour', 'day', 'week', 'month', 'year'] as const
export type PayRate = typeof payRates[number]

export type JobPay = {
  rate: PayRate
} & (
  | {
      type: typeof payTypes[0 | 1 | 2]
      amount1: number
      amount2: undefined
    }
  | {
      type: typeof payTypes[3]
      amount1: number
      amount2: number
    }
)

export const applicationStatuses = [
  'Applied',
  'Interview',
  'Interviewed',
  'Rejected',
  'Offer',
] as const

export type ApplicationStatusOptions = typeof applicationStatuses[number]

export const submissionMethods = [
  'Job Board',
  'Agency',
  'Company Website',
  'Email',
  'In-person',
] as const

export type SubmissionMethod = typeof submissionMethods[number]

export type Person = {
  position: string
  name: string
  email: string | null
  phoneNumber: string | null
}

export type JobApplication = {
  // Basic Information
  companyName: string
  jobTitle: string
  jobLocationType: JobLocationType
  jobLocation: Place | null
  jobType: JobType
  // Compensation
  pay: JobPay
  // Application Details
  dateApplied: number
  jobBoard: string
  submissionMethod: SubmissionMethod
  applicationLink: string | null
  applicationStatus: ApplicationStatusOptions
  interviewDate: number | null
  // Notable People
  notablePeople: Person[]
}

export type JobApplicationResponse = JobApplication & {
  user_id: string
}
