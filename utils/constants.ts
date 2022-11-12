const isDev = process.env.NODE_ENV === 'development'

export const BASE_URL = isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_VERCEL_URL

export const BASE_API_URL = isDev ? 'http://localhost:3000' : ''

export const JOB_TYPES = ['Full-time', 'Part-time', 'Temporary', 'Contract', 'Internship'] as const

export const JOB_LOCATION_TYPES = ['In-person', 'Remote', 'Hybrid'] as const

export const PAY_TYPES = ['min', 'max', 'exact', 'range'] as const

export const PAY_RATES = ['hour', 'day', 'week', 'month', 'year'] as const

export const APPLICATION_STATUSES = [
  'Applied',
  'Interview',
  'Interviewed',
  'Rejected',
  'Offer',
] as const

export const SUBMISSION_METHODS = [
  'Job Board',
  'Agency',
  'Company Website',
  'Email',
  'In-person',
] as const
