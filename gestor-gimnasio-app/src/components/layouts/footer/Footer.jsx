import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import environment from '../../../environments/environment'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        padding: '16px',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} by {environment.nombreApp}
      </Typography>
      <Link
        href="/contacto"
        variant="body2"
        sx={{
          display: 'block',
          marginTop: '8px',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Contactate con Fit Manager
      </Link>
    </Box>
  )
}

export default Footer
