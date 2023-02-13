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
    async ({ id, data }) => {
      const response = await httpAPI.post(`/applications/edit/${id}`, data)
      return response.data
    },
    {
      ...options,
      async onSuccess(data, { id }) {
        await queryClient.refetchQueries(['applications'])
        queryClient.setQueryData(['application', id], data)
        await queryClient.refetchQueries(['application', id], { exact: true })
      },
    }
  )
}

export default useEditApplication
