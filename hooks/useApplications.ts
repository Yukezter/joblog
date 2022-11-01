import { useQuery } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { JobApplication } from '../types'
import { Data } from '../pages/api/applications'

type Filters = Partial<
  Pick<JobApplication, 'jobTitle' | 'jobType' | 'jobLocationType' | 'applicationStatus'>
> & {
  dateApplied?: string
}

type SortBy = 'dateApplied' | 'companyName' | 'jobTitle' | 'applicationStatus'

const useApplications = (filters: Filters, sortBy: SortBy) => {
  // const params = new URLSearchParams(filters)
  // console.log(params.toString())

  // return useQuery(['applications'], async () => {
  //   const res = await httpAPI.get<Data>(`/applications?${params.toString()}`)
  //   return res.data
  // })

  return useQuery(['applications', filters, sortBy], async ({ queryKey }) => {
    const params = new URLSearchParams({
      ...(queryKey[1] as Filters),
      sortBy: queryKey[2] as string,
    })

    console.log(params.toString())

    const res = await httpAPI.get<Data>(`/applications?${params.toString()}`)
    return res.data
  })
}

export default useApplications
