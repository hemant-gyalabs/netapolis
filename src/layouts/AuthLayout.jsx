import { Box, Container, Paper, Typography, Link, Stack, useMediaQuery, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#121212',
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  letterSpacing: '1px',
  color: theme.palette.primary.main,
}));

const AuthLayoutSidebar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'url(/background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(8, 29, 74, 0.85)',
    zIndex: 1,
  },
}));

const SidebarContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  
  const currentYear = new Date().getFullYear();
  
  return (
    <AuthLayoutRoot>
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', alignItems: 'center' }}>
        <Paper 
          elevation={24} 
          sx={{ 
            width: '100%', 
            overflow: 'hidden',
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            borderRadius: 3,
          }}
        >
          {/* Left side with form */}
          <Box 
            sx={{ 
              width: isMobile ? '100%' : '50%', 
              py: 6, 
              px: 4,
              [theme.breakpoints.up('sm')]: {
                px: 6,
              },
            }}
          >
            <LogoWrapper>
              <LogoText className="logo-text">NEOPOLIS INFRA</LogoText>
            </LogoWrapper>
            
            {children}
            
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Stack direction="row" justifyContent="center" spacing={2}>
                <Link component={RouterLink} to="/login" underline="hover">
                  Login
                </Link>
                <Link component={RouterLink} to="/register" underline="hover">
                  Register
                </Link>
                <Link component={RouterLink} to="/forgot-password" underline="hover">
                  Forgot Password
                </Link>
              </Stack>
              <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
                &copy; {currentYear} Neopolis Infra. All rights reserved.
              </Typography>
            </Box>
          </Box>
          
          {/* Right side with image and text */}
          {!isMobile && (
            <AuthLayoutSidebar sx={{ width: '50%' }}>
              <SidebarContent>
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    mb: 4
                  }}
                >
                  Welcome to Neopolis Infra Dashboard
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 400 }}>
                  Manage your real estate projects, track scores, and monitor performance.
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Streamline your workflow with our comprehensive dashboard designed specifically for the real estate industry.
                </Typography>
              </SidebarContent>
            </AuthLayoutSidebar>
          )}
        </Paper>
      </Container>
    </AuthLayoutRoot>
  );
};

export default AuthLayout;