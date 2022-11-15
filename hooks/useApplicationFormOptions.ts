import { useQuery } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Data } from '../pages/api/applications/form/options'

const useApplicationFormOptions = () => {
  return useQuery(
    ['applications', 'form-options'],
    async () => {
      const res = await httpAPI.get<Data>(`/applications/form/options`)
      return res.data
    },
    {
      initialData: {
        jobTitles: [],
        jobBoards: [],
        peoplePositions: [],
      },
    }
  )
}

export default useApplicationFormOptions
