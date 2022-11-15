import { useQueryClient, useMutation, UseMutationOptions } from '@tanstack/react-query'
import httpAPI from '../utils/httpAPI'
import { Body, Data } from '../pages/api/applications/edit/[id]'

type Variables = {
  id: string
  data: Body
}

const useEditApplication = (options: UseMutationOptions<Data, unknown, Variables> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<Data, unknown, Variables>(
    ['applications', 'edit'],
    async ({ id, data }) => {
      const response = await httpAPI.post(`/applications/edit/${id}`, data)
      return response.data
    },
    {
      ...options,
      async onSuccess(data, { id }) {
        queryClient.setQueryData(['applications', id], data)
        await queryClient.resetQueries(['applications'], { exact: true })
      },
    }
  )
}

export default useEditApplication
