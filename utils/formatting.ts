import { JobApplicationResponse } from '../types'

export const { format: toLocale } = new Intl.NumberFormat('en-US', {
  currency: 'USD',
})

const { format: toCompact } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
})

// export const formatPay = (pay: JobApplicationResponse['pay']) => {
//   let text = format(pay.amount[0])

//   if (pay.type === 'range') {
//     text.concat(`-${format(pay.amount[1])}`)
//   }

//   return text.concat(`/${pay.rate}`)
// }

export const formatPay = (pay: JobApplicationResponse['pay']) => {
  let text = toCompact(pay.amount1)

  if (pay.type === 'range') {
    text = text.concat(`-${toCompact(pay.amount2)}`)
  }

  return text.concat(`/${pay.rate}`)
}
