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

// export const INTERVIEW_REMINDER_TIMESS = [
//   { label: '5 Minutes', minutesBeforeInterview: 5 },
//   { label: '10 Minutes', minutesBeforeInterview: 10 },
//   { label: '15 Minutes', minutesBeforeInterview: 15 },
//   { label: '30 Minutes', minutesBeforeInterview: 30 },
//   { label: '1 Hour', minutesBeforeInterview: 60 },
//   { label: '2 Hours', minutesBeforeInterview: 120 },
//   { label: '1 Day', minutesBeforeInterview: 1440 },
//   { label: '2 Days', minutesBeforeInterview: 2880 },
//   { label: '1 Week', minutesBeforeInterview: 10080 },
// ] as const 

export const INTERVIEW_REMINDER_TIMES = {
  5: '5 Minutes',
  10: '10 Minutes',
  15: '15 Minutes',
  30: '30 Minutes',
  60: '1 Hour',
  120: '2 Hours',
  1440: '1 Day',
  2880: '2 Days',
  10080: '1 Week'
}