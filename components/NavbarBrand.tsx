import Typography from '@mui/material/Typography'
import LogoIcon from '@mui/icons-material/PendingActions'
import Link from './Link'

type NavbarBrandProps = {
  href?: string
}

const NavbarBrand = ({ href = '/' }: NavbarBrandProps) => {
  return (
    <Link href={href} color='inherit' underline='hover' display='flex' alignItems='center'>
      <LogoIcon />
      <Typography variant='h5' fontWeight={600} ml={0.25}>
        JobLog
      </Typography>
    </Link>
  )
}

export default NavbarBrand
