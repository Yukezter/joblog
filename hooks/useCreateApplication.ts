// import { AxiosResponse } from 'axios'
import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Body, Data } from '../pages/api/applications/create'

const useCreateApplication = (options: UseMutationOptions<Data, unknown, Body> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<Data, unknown, Body>(
    async data => {
      const response = await httpAPI.post('/applications/create', data)
      return response.data
    },
    {
      ...options,
      async onSuccess() {
        await queryClient.refetchQueries(['applications'])
      },
    }
  )
}

export default useCreateApplication
