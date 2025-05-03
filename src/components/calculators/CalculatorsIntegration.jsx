import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Tabs,
  Tab,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { 
  CalculateOutlined as CalculateIcon,
  HomeWorkOutlined as PropertyIcon,
  AccountBalanceOutlined as BankIcon,
  RequestQuoteOutlined as StampDutyIcon,
  OpenInNewOutlined as OpenIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

/**
 * Calculators Integration Component
 * 
 * This component provides an interface within the internal dashboard
 * to access the financial calculators developed for the public website.
 */
const CalculatorsIntegration = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Base URL for the calculators on the public website
  const baseURL = '/calculators';
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Open calculator in new tab
  const openCalculator = (calculatorPath) => {
    window.open(`${baseURL}${calculatorPath}`, '_blank');
  };
  
  // Calculator information
  const calculators = [
    {
      id: 'emi',
      name: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installments for home loans based on principal amount, interest rate, and loan tenure.',
      icon: <BankIcon fontSize="large" />,
      path: '/emi-calculator',
      color: 'primary.main',
      features: [
        'Calculate monthly payment amount',
        'View amortization schedule',
        'Analyze interest vs. principal breakdown',
        'Adjust loan parameters in real-time'
      ]
    },
    {
      id: 'investment',
      name: 'Property Investment Calculator',
      description: 'Analyze the return on investment for property purchases, including rental income, appreciation, and expenses.',
      icon: <PropertyIcon fontSize="large" />,
      path: '/investment-calculator',
      color: 'secondary.main',
      features: [
        'Calculate ROI percentage',
        'Estimate cash flow',
        'Account for expenses and taxes',
        'Compare different investment scenarios'
      ]
    },
    {
      id: 'stamp-duty',
      name: 'Stamp Duty Calculator',
      description: 'Calculate stamp duty and registration charges for property transactions based on property value and location.',
      icon: <StampDutyIcon fontSize="large" />,
      path: '/stamp-duty-calculator',
      color: 'success.main',
      features: [
        'Calculate stamp duty by state',
        'Include registration charges',
        'Account for property type differences',
        'Provide detailed fee breakdown'
      ]
    }
  ];
  
  // Get current calculator
  const currentCalculator = calculators[activeTab];
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalculateIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Financial Calculators
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          These financial calculators help clients make informed decisions about their real estate investments.
          They are integrated into the public website and can be accessed directly from this dashboard.
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          {calculators.map((calc) => (
            <Tab 
              key={calc.id}
              icon={calc.icon} 
              label={calc.name} 
              sx={{ 
                fontWeight: activeTab === calculators.indexOf(calc) ? 600 : 400,
                minHeight: 64
              }} 
            />
          ))}
        </Tabs>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: 'background.neutral',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '50%', 
                    mr: 2,
                    backgroundColor: currentCalculator.color,
                    color: 'white'
                  }}
                >
                  {currentCalculator.icon}
                </Box>
                
                <Typography variant="h5" component="h2">
                  {currentCalculator.name}
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                {currentCalculator.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Key Features:
              </Typography>
              
              <ul>
                {currentCalculator.features.map((feature, index) => (
                  <li key={index}>
                    <Typography variant="body2" paragraph>
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<OpenIcon />}
                onClick={() => openCalculator(currentCalculator.path)}
                sx={{ mt: 2 }}
              >
                Open Calculator
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: 'background.neutral',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                Using the {currentCalculator.name} with Clients
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" paragraph>
                When working with clients, you can use this calculator to:
              </Typography>
              
              {currentCalculator.id === 'emi' && (
                <>
                  <Typography variant="body1" paragraph>
                    <strong>1. Demonstrate Affordability:</strong> Help clients understand how much they can afford to borrow based on their budget for monthly payments.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>2. Compare Loan Options:</strong> Show how different interest rates, loan amounts, and tenures affect the monthly EMI and total interest paid.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>3. Explain Amortization:</strong> Educate clients about how their payments are divided between principal and interest over time.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>4. Create Payment Plans:</strong> Generate a payment schedule that clients can use for financial planning.
                  </Typography>
                </>
              )}
              
              {currentCalculator.id === 'investment' && (
                <>
                  <Typography variant="body1" paragraph>
                    <strong>1. Evaluate Opportunities:</strong> Help clients compare different property investments based on potential returns.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>2. Set Realistic Expectations:</strong> Provide clear projections about rental yields and capital appreciation.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>3. Account for Expenses:</strong> Ensure clients understand all costs associated with property ownership.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>4. Demonstrate Long-term Value:</strong> Show the compounding benefits of property investment over time.
                  </Typography>
                </>
              )}
              
              {currentCalculator.id === 'stamp-duty' && (
                <>
                  <Typography variant="body1" paragraph>
                    <strong>1. Budget Accurately:</strong> Help clients include all transaction costs when budgeting for a property purchase.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>2. Explain Regional Differences:</strong> Clarify how stamp duty varies by state and property type.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>3. Identify Savings:</strong> Show potential savings through available exemptions or concessions.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    <strong>4. Complete Transactions:</strong> Ensure all required fees are paid correctly to avoid delays in registration.
                  </Typography>
                </>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Calculator Screenshots:
              </Typography>
              
              <Box 
                sx={{ 
                  height: 200, 
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  mt: 2
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Calculator preview image will be loaded here.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        All Financial Calculators
      </Typography>
      
      <Grid container spacing={3}>
        {calculators.map((calculator) => (
          <Grid item xs={12} sm={6} md={4} key={calculator.id}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: '50%', 
                      mr: 2,
                      backgroundColor: calculator.color,
                      color: 'white'
                    }}
                  >
                    {calculator.icon}
                  </Box>
                  
                  <Typography variant="h6" component="h3">
                    {calculator.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {calculator.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => openCalculator(calculator.path)}
                >
                  Open Calculator
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CalculatorsIntegration;