import { AxiosResponse } from 'axios'
import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Data } from '../pages/api/applications/create'

const useCreateApplication = (
  options: UseMutationOptions<AxiosResponse<void>, unknown, Data> = {}
) => {
  const queryClient = useQueryClient()

  return useMutation<AxiosResponse<void>, unknown, Data>(
    ['applications', 'create'],
    async data => httpAPI.post<void>('/applications/create', data),
    {
      ...options,
      async onSuccess() {
        await queryClient.resetQueries(['applications'], { exact: true })
      },
    }
  )
}

export default useCreateApplication
