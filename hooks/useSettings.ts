import { useQuery } from "@tanstack/react-query";
import httpAPI from '../utils/httpAPI'
import { Data } from '../pages/api/users/settings'

const useSettings = (id?: string) => {
  return useQuery(['settings', id], async () => {
    const { data } = await httpAPI.get<Data>('/users/settings')
    return data
  }, { enabled: id !== undefined })
}

export default useSettings