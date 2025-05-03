import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  Button,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  AssessmentOutlined as AssessmentIcon,
  FactCheckOutlined as FactCheckIcon,
  DescriptionOutlined as DescriptionIcon,
  InsightsOutlined as InsightsIcon,
  PersonOutline as PersonIcon,
  HomeOutlined as HomeIcon
} from '@mui/icons-material';

import ScoreFactorsChart from './charts/ScoreFactorsChart';
import ScoreBreakdownPanel from './metrics/ScoreBreakdownPanel';
import { formatDate, getScoreColor } from '../../utils/chartUtils';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`score-details-tabpanel-${index}`}
      aria-labelledby={`score-details-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Format to display name
const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'Unknown';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Get status color based on value
const getStatusColor = (status, type) => {
  // Lead status colors
  if (type === 'lead') {
    switch (status) {
      case 'new': return 'info';
      case 'contacted': return 'primary';
      case 'qualified': return 'success';
      case 'negotiation': return 'warning';
      case 'closed': return 'success';
      case 'lost': return 'error';
      default: return 'default';
    }
  }
  
  // Property status colors
  if (type === 'property') {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'primary';
      default: return 'default';
    }
  }
  
  // Default
  return 'default';
};

// Format status text
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Main component
const ScoreDetailsPanel = ({ score, loading }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
            <Box sx={{ width: '80%' }}>
              <Skeleton variant="text" height={32} width="50%" />
              <Skeleton variant="text" height={24} width="30%" />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </Paper>
    );
  }
  
  if (!score) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          p: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          No Score Data Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a score from the list to view detailed information
        </Typography>
      </Paper>
    );
  }
  
  // Extract score details based on type
  const getDetails = () => {
    // Lead details
    if (score.type === 'lead') {
      return {
        title: score.leadDetails?.name || 'Unknown Lead',
        subtitle: score.leadDetails?.email || '',
        status: score.leadDetails?.status,
        avatar: {
          text: (score.leadDetails?.name?.[0] || 'L'),
          color: 'primary'
        },
        icon: <PersonIcon />,
        assigned: score.leadDetails?.assignedTo ? 
                 formatName(score.leadDetails.assignedTo.firstName, score.leadDetails.assignedTo.lastName) : 
                 'Unassigned',
        details: [
          { label: 'Email', value: score.leadDetails?.email || 'Not provided' },
          { label: 'Phone', value: score.leadDetails?.phone || 'Not provided' },
          { label: 'Source', value: score.leadDetails?.source ? 
                              formatStatus(score.leadDetails.source) : 
                              'Unknown' },
          { label: 'Budget', value: score.leadDetails?.budget ? 
                             `₹${score.leadDetails.budget.min.toLocaleString()} - ₹${score.leadDetails.budget.max.toLocaleString()}` : 
                             'Not specified' },
          { label: 'Interested In', value: score.leadDetails?.interestedIn?.join(', ') || 'Not specified' }
        ]
      };
    }
    
    // Property details
    if (score.type === 'property') {
      return {
        title: score.propertyDetails?.name || 'Unknown Property',
        subtitle: `${score.propertyDetails?.location?.area || ''}, ${score.propertyDetails?.location?.city || ''}`,
        status: score.propertyDetails?.status,
        avatar: {
          text: (score.propertyDetails?.name?.[0] || 'P'),
          color: 'secondary'
        },
        icon: <HomeIcon />,
        details: [
          { label: 'Type', value: score.propertyDetails?.type ? formatStatus(score.propertyDetails.type) : 'Unknown' },
          { label: 'Location', value: `${score.propertyDetails?.location?.area || ''}, ${score.propertyDetails?.location?.city || ''}` },
          { label: 'Price', value: score.propertyDetails?.price ? `₹${score.propertyDetails.price.toLocaleString()}` : 'Not specified' },
          { label: 'Size', value: score.propertyDetails?.size ? `${score.propertyDetails.size.toLocaleString()} sq ft` : 'Not specified' },
          { label: 'Amenities', value: score.propertyDetails?.amenities?.join(', ') || 'None listed' }
        ]
      };
    }
    
    // Agent details
    if (score.type === 'agent') {
      return {
        title: score.agentDetails?.user ? 
               formatName(score.agentDetails.user.firstName, score.agentDetails.user.lastName) : 
               'Unknown Agent',
        subtitle: score.agentDetails?.user?.email || '',
        avatar: {
          text: (score.agentDetails?.user?.firstName?.[0] || 'A'),
          color: 'info'
        },
        icon: <PersonIcon />,
        details: [
          { label: 'Email', value: score.agentDetails?.user?.email || 'Not provided' },
          { label: 'Performance Period', value: score.agentDetails?.period ? formatStatus(score.agentDetails.period) : 'Monthly' },
          { label: 'Leads Handled', value: score.agentDetails?.performance?.leadsHandled || 0 },
          { label: 'Conversion Rate', value: `${score.agentDetails?.performance?.conversionRate || 0}%` },
          { label: 'Revenue Generated', value: score.agentDetails?.performance?.revenueGenerated ? 
                                            `₹${score.agentDetails.performance.revenueGenerated.toLocaleString()}` : 
                                            '₹0' },
          { label: 'Customer Satisfaction', value: `${score.agentDetails?.performance?.customerSatisfaction || 0}%` }
        ]
      };
    }
    
    return {
      title: 'Unknown Score',
      subtitle: '',
      avatar: {
        text: '?',
        color: 'default'
      },
      icon: <AssessmentIcon />,
      details: []
    };
  };
  
  const details = getDetails();
  const scoreColor = getScoreColor(score.score);
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      {/* Header with score and basic info */}
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: `${scoreColor}.light`,
              color: `${scoreColor}.dark`,
              fontWeight: 'bold',
              fontSize: '1.5rem',
              mr: 2
            }}
          >
            {score.score.toFixed(1)}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {details.title}
              </Typography>
              
              {details.status && (
                <Chip
                  label={formatStatus(details.status)}
                  size="small"
                  color={getStatusColor(details.status, score.type)}
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {details.subtitle}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<AssessmentIcon fontSize="small" />}
          >
            View Full Report
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Score details tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="score details tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: scoreColor === 'primary' ? 'primary.main' : `${scoreColor}.main`,
              },
            }}
          >
            <Tab
              icon={<FactCheckIcon fontSize="small" />}
              iconPosition="start"
              label="Overview"
              id="score-details-tab-0"
              aria-controls="score-details-tabpanel-0"
              sx={{ fontWeight: 500 }}
            />
            <Tab
              icon={<InsightsIcon fontSize="small" />}
              iconPosition="start"
              label="Factors"
              id="score-details-tab-1"
              aria-controls="score-details-tabpanel-1"
              sx={{ fontWeight: 500 }}
            />
            <Tab
              icon={<TimelineIcon fontSize="small" />}
              iconPosition="start"
              label="History"
              id="score-details-tab-2"
              aria-controls="score-details-tabpanel-2"
              sx={{ fontWeight: 500 }}
            />
            <Tab
              icon={<DescriptionIcon fontSize="small" />}
              iconPosition="start"
              label="Notes"
              id="score-details-tab-3"
              aria-controls="score-details-tabpanel-3"
              sx={{ fontWeight: 500 }}
            />
          </Tabs>
        </Box>
      </Box>
      
      {/* Tab content */}
      <Box sx={{ px: 3 }}>
        {/* Overview tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {details.details.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                      {item.label}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {details.assigned && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Assigned To
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: 'info.light' }}>
                      {details.assigned[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {details.assigned}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Real Estate Agent
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Metadata
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    Created:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(score.createdAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    Last Updated:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(score.updatedAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                    Created By:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {score.createdBy ? formatName(score.createdBy.firstName, score.createdBy.lastName) : 'Unknown'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Score breakdown */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Score Breakdown
              </Typography>
              
              {score.scoreFactors && score.scoreFactors.length > 0 ? (
                <ScoreBreakdownPanel
                  score={score.score}
                  scoreFactors={score.scoreFactors}
                  title="Score Analysis"
                />
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No score factors available for this score
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Factors tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Score Factors Analysis
              </Typography>
              
              {score.scoreFactors && score.scoreFactors.length > 0 ? (
                <Box
                  sx={{
                    height: 400,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 2
                  }}
                >
                  <ScoreFactorsChart
                    data={score.scoreFactors}
                    totalScore={score.score}
                    height={370}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No score factors available for this score
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* History tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Score history tracking will be implemented in a future update
          </Typography>
        </TabPanel>
        
        {/* Notes tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Notes
            </Typography>
            
            {score.notes ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="body2">{score.notes}</Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No notes available for this score
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default ScoreDetailsPanel;