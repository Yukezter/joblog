import { AxiosResponse } from 'axios'
import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Data } from '../pages/api/applications/edit/[id]'

const useEditApplication = (
  id: string,
  options: UseMutationOptions<AxiosResponse<void>, unknown, Data> = {}
) => {
  const queryClient = useQueryClient()

  return useMutation<AxiosResponse<void>, unknown, Data>(
    ['applications', 'edit', id],
    async data => httpAPI.post<void>(`/applications/edit/${id}`, data),
    {
      ...options,
      async onSuccess() {
        await queryClient.resetQueries(['applications'], { exact: true })
      },
    }
  )
}

export default useEditApplication
