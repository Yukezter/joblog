import { useQuery } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Data } from '../pages/api/applications/[id]'

const useApplication = (id?: string) => {
  return useQuery(
    ['application', id],
    async () => {
      const res = await httpAPI.get<Data>(`/applications/${id}`)
      return res.data
    },
    {
      enabled: id !== undefined,
    }
  )
}

export default useApplication
