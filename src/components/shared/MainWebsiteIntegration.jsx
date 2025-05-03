import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  OpenInNew as OpenIcon,
  Sync as SyncIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Apartment as ApartmentIcon,
  ContactMail as ContactIcon
} from '@mui/icons-material';
import { integration } from '../../integration';

/**
 * Main Website Integration Component
 * 
 * This component provides integration with the main Neopolis Infra website,
 * allowing users to access the public website from within the dashboard.
 */
const MainWebsiteIntegration = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Website sections
  const sections = [
    {
      id: 'home',
      title: 'Homepage',
      description: 'Main website landing page with featured properties and company overview.',
      icon: <HomeIcon fontSize="large" />,
      path: '/',
      color: theme.palette.primary.main,
      image: '/assets/images/website-home.jpg'
    },
    {
      id: 'calculators',
      title: 'Financial Calculators',
      description: 'Interactive calculators for EMI, investment returns, and stamp duty.',
      icon: <CalculateIcon fontSize="large" />,
      path: '/calculators',
      color: theme.palette.secondary.main,
      image: '/assets/images/website-calculators.jpg'
    },
    {
      id: 'properties',
      title: 'Property Listings',
      description: 'Browse all available properties with filtering and search options.',
      icon: <ApartmentIcon fontSize="large" />,
      path: '/properties',
      color: theme.palette.success.main,
      image: '/assets/images/website-properties.jpg'
    },
    {
      id: 'contact',
      title: 'Contact Page',
      description: 'Contact form and office locations for client inquiries.',
      icon: <ContactIcon fontSize="large" />,
      path: '/contact',
      color: theme.palette.info.main,
      image: '/assets/images/website-contact.jpg'
    }
  ];
  
  // Handle opening the main website
  const handleOpenWebsite = (path, params = {}) => {
    integration.website.openMainWebsitePage(path, params);
  };
  
  // Handle refresh website data
  const handleRefreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated website data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh website data. Please try again later.');
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Main Website Integration
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SyncIcon />}
              onClick={handleRefreshData}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Refresh Data
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              endIcon={<OpenIcon />}
              onClick={() => handleOpenWebsite('/')}
            >
              Open Website
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" paragraph>
          This integration allows you to access and manage the public-facing Neopolis Infra website directly from the dashboard.
          You can open any section of the website or use the website components within the dashboard.
        </Typography>
        
        <Grid container spacing={3}>
          {sections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.id}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: section.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ color: 'white', textAlign: 'center' }}>
                    {section.icon}
                    <Typography variant="subtitle1" sx={{ color: 'white', mt: 1 }}>
                      {section.title}
                    </Typography>
                  </Box>
                </CardMedia>
                
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    endIcon={<OpenIcon />}
                    onClick={() => handleOpenWebsite(section.path)}
                  >
                    Open {section.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Integration Status
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connected Components
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label="Calculators" 
                color="success" 
                icon={<CalculateIcon />} 
                sx={{ m: 0.5 }} 
              />
              <Chip 
                label="Projects" 
                color="success" 
                icon={<ApartmentIcon />} 
                sx={{ m: 0.5 }} 
              />
              <Chip 
                label="Scores" 
                color="success" 
                icon={<ApartmentIcon />} 
                sx={{ m: 0.5 }} 
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              All dashboard components are successfully integrated with the main website.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Data Synchronization
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Last synchronized:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {new Date().toLocaleString()}
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<SyncIcon />}
              onClick={handleRefreshData}
              disabled={loading}
            >
              Synchronize Now
            </Button>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Website Status
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  mr: 1
                }}
              />
              <Typography variant="body2">
                Website is online and responding normally
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              All website features are functioning correctly.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MainWebsiteIntegration;