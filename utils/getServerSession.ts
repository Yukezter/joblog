import { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'

const getServerSession = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  return session
}

export default getServerSession
