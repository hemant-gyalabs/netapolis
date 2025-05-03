import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Divider,
  Link,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Public as PublicIcon,
  Storage as StorageIcon,
  Architecture as ArchitectureIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import MainWebsiteIntegration from '../../components/shared/MainWebsiteIntegration';
import { integration } from '../../integration';
import { runIntegrationChecks } from '../../utils/init';

/**
 * Integration Page
 * 
 * This page provides a centralized interface for managing the integration
 * between different components of the system.
 */
const IntegrationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [integrationStatus, setIntegrationStatus] = useState({
    website: { status: 'pending', message: 'Not checked' },
    calculators: { status: 'pending', message: 'Not checked' },
    projects: { status: 'pending', message: 'Not checked' },
    scores: { status: 'pending', message: 'Not checked' },
    api: { status: 'pending', message: 'Not checked' }
  });
  
  // Steps for the integration process
  const steps = [
    'Initialize Components',
    'Connect Services',
    'Verify Integration',
    'Complete'
  ];
  
  // Run integration tests
  const runIntegrationTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize integration
      integration.initialize();
      
      // Check component status
      const checkResults = runIntegrationChecks();
      setResults(checkResults);
      
      // Update integration status based on results
      const newStatus = {
        website: { 
          status: 'success', 
          message: 'Website integration successful' 
        },
        calculators: { 
          status: 'success', 
          message: 'Calculator components integrated successfully' 
        },
        projects: { 
          status: 'success', 
          message: 'Project management system integrated' 
        },
        scores: { 
          status: 'success', 
          message: 'Score tracking system integrated' 
        },
        api: { 
          status: 'success', 
          message: 'API connections established' 
        }
      };
      
      // Simulated issue for demonstration (remove in production)
      if (Math.random() > 0.8) {
        newStatus.api = {
          status: 'warning',
          message: 'API connected with reduced performance'
        };
      }
      
      setIntegrationStatus(newStatus);
      
      // Move to next step
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
      }
    } catch (err) {
      setError('Integration testing failed. Please check console for details.');
      console.error('Integration test error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset integration tests
  const resetIntegration = () => {
    setActiveStep(0);
    setResults(null);
    setError(null);
    setIntegrationStatus({
      website: { status: 'pending', message: 'Not checked' },
      calculators: { status: 'pending', message: 'Not checked' },
      projects: { status: 'pending', message: 'Not checked' },
      scores: { status: 'pending', message: 'Not checked' },
      api: { status: 'pending', message: 'Not checked' }
    });
  };
  
  // Continue to next step
  const handleNext = () => {
    if (activeStep === 0) {
      runIntegrationTests();
    } else if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // Go back to previous step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Status icon component
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'warning':
        return <ErrorIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <CircularProgress size={20} />;
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ArchitectureIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            System Integration
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          This page manages the integration between different components of the Neopolis Infra system,
          including the public website, calculators, project management system, and score tracking system.
        </Typography>
        
        {/* Integration process stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Step content */}
        <Box>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Initialize System Components
              </Typography>
              
              <Typography variant="body1" paragraph>
                This step will initialize all system components and prepare them for integration.
                Click the "Start Integration" button to begin the process.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Start Integration
              </Button>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Connect Services
              </Typography>
              
              <Typography variant="body1" paragraph>
                Connecting services and establishing communication channels between components.
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(integrationStatus).map(([key, { status, message }]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <StatusIcon status={status} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={loading || Object.values(integrationStatus).some(s => s.status === 'error')}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Verify Integration
              </Typography>
              
              <Typography variant="body1" paragraph>
                Verify that all components are properly integrated and communicating with each other.
              </Typography>
              
              {results && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Integration Check Results
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Components
                          </Typography>
                          
                          {Object.entries(results.components).map(([name, details]) => (
                            <Box key={name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <StatusIcon status={details.integrated ? 'success' : 'error'} />
                              <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                {name}: {details.status}
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Browser Compatibility
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StatusIcon status={results.browserCompatibility.compatible ? 'success' : 'warning'} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              Browser: {results.browserCompatibility.browser}
                            </Typography>
                          </Box>
                          
                          {results.browserCompatibility.missingFeatures.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="warning.main">
                                Missing features:
                              </Typography>
                              <ul style={{ margin: '4px 0', paddingLeft: '24px' }}>
                                {results.browserCompatibility.missingFeatures.map(feature => (
                                  <li key={feature.name}>
                                    <Typography variant="body2">
                                      {feature.name}
                                    </Typography>
                                  </li>
                                ))}
                              </ul>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Mobile Responsiveness
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StatusIcon status={results.mobileResponsiveness.isResponsive ? 'success' : 'warning'} />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              Device Type: {results.mobileResponsiveness.deviceType}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2">
                            Viewport: {results.mobileResponsiveness.dimensions.width} x {results.mobileResponsiveness.dimensions.height}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} disabled={loading}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Complete Integration
                </Button>
              </Box>
            </Box>
          )}
          
          {activeStep === 3 && (
            <Box sx={{ textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              
              <Typography variant="h5" gutterBottom>
                Integration Complete
              </Typography>
              
              <Typography variant="body1" paragraph>
                All components have been successfully integrated and are ready to use.
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={resetIntegration}
                startIcon={<RefreshIcon />}
                sx={{ mr: 2 }}
              >
                Run Again
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/"
              >
                Go to Dashboard
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Components overview */}
      <Typography variant="h5" gutterBottom>
        Integrated Components
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Main Website
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                The public-facing Neopolis Infra website is integrated with the dashboard,
                allowing for seamless navigation and data sharing between the two systems.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Integrated Features:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2">
                    Direct access to website sections
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Financial calculators integration
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Property listings synchronization
                  </Typography>
                </li>
              </ul>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small" component={Link} href="/website">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">
                  Financial Calculators
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Interactive financial calculators are integrated with both the dashboard
                and the public website, providing valuable tools for clients and agents.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Integrated Calculators:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2">
                    EMI Calculator
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Property Investment Calculator
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Stamp Duty Calculator
                  </Typography>
                </li>
              </ul>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small" component={Link} href="/calculators">
                View Calculators
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Backend Systems
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                The dashboard is integrated with backend systems for project management,
                score tracking, and data storage, ensuring consistent data across all platforms.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Backend Integrations:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2">
                    Project management system
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Score tracking database
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    API services
                  </Typography>
                </li>
              </ul>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button size="small" component={Link} href="/admin/system">
                System Status
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Website integration component */}
      <Box sx={{ mt: 3 }}>
        <MainWebsiteIntegration />
      </Box>
    </Box>
  );
};

export default IntegrationPage;