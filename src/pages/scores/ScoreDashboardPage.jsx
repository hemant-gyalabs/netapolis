import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Chip,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import { scoreService } from '../../services/score.service';
import KpiMetricsRow from '../../components/scores/metrics/KpiMetricsRow';
import ScoreDistributionChart from '../../components/scores/charts/ScoreDistributionChart';
import ScoreTrendChart from '../../components/scores/charts/ScoreTrendChart';
import StatusDistributionChart from '../../components/scores/charts/StatusDistributionChart';
import MetricComparisonChart from '../../components/scores/charts/MetricComparisonChart';
import ScoreDetailsPanel from '../../components/scores/ScoreDetailsPanel';
import { generateScoreStats, generateTopScores } from '../../utils/scoreTestData';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Format score distribution data for chart
const formatScoreDistribution = (data) => {
  if (!data) return [];
  
  // Group by score range
  const scoreRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  const result = [];
  
  for (const range of scoreRanges) {
    const leadCount = data.find(item => item._id.range === range && item._id.type === 'lead')?.count || 0;
    const propertyCount = data.find(item => item._id.range === range && item._id.type === 'property')?.count || 0;
    const agentCount = data.find(item => item._id.range === range && item._id.type === 'agent')?.count || 0;
    
    result.push({
      range,
      lead: leadCount,
      property: propertyCount,
      agent: agentCount
    });
  }
  
  return result;
};

// Format score trend data for chart
const formatScoreTrend = (data) => {
  if (!data) return [];
  
  // Get last 6 months
  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short' });
    months.push({
      month: monthName,
      monthNum: month.getMonth() + 1,
      year: month.getFullYear()
    });
  }
  
  // Match data with months
  return months.map(month => {
    const leadScore = data.find(item => item._id.month === month.monthNum && 
                                    item._id.year === month.year && 
                                    item._id.type === 'lead')?.averageScore || null;
    
    const propertyScore = data.find(item => item._id.month === month.monthNum && 
                                        item._id.year === month.year && 
                                        item._id.type === 'property')?.averageScore || null;
    
    const agentScore = data.find(item => item._id.month === month.monthNum && 
                                     item._id.year === month.year && 
                                     item._id.type === 'agent')?.averageScore || null;
    
    return {
      month: month.month,
      lead: leadScore,
      property: propertyScore,
      agent: agentScore
    };
  });
};

// Format lead status data for chart
const formatLeadStatusData = (data) => {
  if (!data) return [];
  
  // Map status to readable names
  const statusMap = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    negotiation: 'Negotiation',
    closed: 'Closed',
    lost: 'Lost'
  };
  
  return data.map(item => ({
    status: statusMap[item._id] || item._id,
    value: item.count,
    averageScore: item.averageScore
  }));
};

// Format property type data for chart
const formatPropertyTypeData = (data) => {
  if (!data) return [];
  
  // Map property type to readable names
  const typeMap = {
    residential: 'Residential',
    commercial: 'Commercial',
    land: 'Land'
  };
  
  return data.map(item => ({
    type: typeMap[item._id] || item._id,
    value: item.count,
    score: item.averageScore
  }));
};

// Main dashboard component
const ScoreDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scoreStats, setScoreStats] = useState(null);
  const [topLeads, setTopLeads] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle create test data
  const handleCreateTestData = async () => {
    try {
      setLoading(true);
      // In a real app, we would call the API to create test data
      // await scoreService.createTestScores();
      
      // For now, use mock data
      setScoreStats(generateScoreStats());
      setTopLeads(generateTopScores('lead', 1));
      setTopProperties(generateTopScores('property', 1));
      setTopAgents(generateTopScores('agent', 1));
      setError(null);
      
      handleMenuClose();
    } catch (error) {
      setError('Failed to create test data: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch score statistics
  const fetchScoreStats = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to get the data
      // const response = await scoreService.getScoreStats();
      // setScoreStats(response.data);
      
      // For now, use mock data
      setScoreStats(generateScoreStats());
      setError(null);
    } catch (error) {
      setError('Failed to fetch score statistics: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch top scores
  const fetchTopScores = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would call the API to get the data
      // const leadResponse = await scoreService.getTopScores('lead', 1);
      // const propertyResponse = await scoreService.getTopScores('property', 1);
      // const agentResponse = await scoreService.getTopScores('agent', 1);
      
      // For now, use mock data
      setTopLeads(generateTopScores('lead', 1));
      setTopProperties(generateTopScores('property', 1));
      setTopAgents(generateTopScores('agent', 1));
      setError(null);
    } catch (error) {
      setError('Failed to fetch top scores: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    fetchScoreStats();
    fetchTopScores();
  }, []);
  
  // Prepare chart data
  const scoreDistributionData = formatScoreDistribution(scoreStats?.scoreDistribution);
  const scoreTrendData = formatScoreTrend(scoreStats?.scoreTrend);
  const leadStatusData = formatLeadStatusData(scoreStats?.leadStats);
  const propertyTypeData = formatPropertyTypeData(scoreStats?.propertyStats);
  
  // Generate KPI metrics from the scoreStats
  const getKpiMetrics = () => {
    if (!scoreStats) return null;
    
    const leadAvg = scoreStats.averageScores.find(item => item._id === 'lead');
    const propertyAvg = scoreStats.averageScores.find(item => item._id === 'property');
    const agentAvg = scoreStats.averageScores.find(item => item._id === 'agent');
    
    // Calculate lead conversion rate from lead stats
    const closedLeads = scoreStats.leadStats.find(item => item._id === 'closed')?.count || 0;
    const qualifiedLeads = scoreStats.leadStats.find(item => item._id === 'qualified')?.count || 0;
    const negotiationLeads = scoreStats.leadStats.find(item => item._id === 'negotiation')?.count || 0;
    const totalLeads = scoreStats.leadStats.reduce((sum, item) => sum + item.count, 0);
    const conversionRate = totalLeads > 0 ? ((closedLeads + qualifiedLeads + negotiationLeads) / totalLeads) * 100 : 0;
    
    return [
      {
        title: 'Average Lead Score',
        value: leadAvg?.averageScore || 0,
        previousValue: (leadAvg?.averageScore || 0) * 0.95, // Simulate a 5% improvement
        icon: <AssessmentIcon fontSize="small" />,
        color: 'primary',
        progressValue: leadAvg?.averageScore || 0,
        isScoreValue: true,
        helperText: 'Average score of all leads in the system',
        onClick: () => navigate('/scores/leads')
      },
      {
        title: 'Conversion Rate',
        value: conversionRate,
        previousValue: conversionRate * 0.9, // Simulate a 10% improvement
        unit: '%',
        icon: <TrendingUpIcon fontSize="small" />,
        color: 'success',
        progressValue: conversionRate,
        helperText: 'Percentage of leads that convert to sales',
        onClick: () => navigate('/scores/leads')
      },
      {
        title: 'Avg. Property Score',
        value: propertyAvg?.averageScore || 0,
        previousValue: (propertyAvg?.averageScore || 0) * 0.97, // Simulate a 3% improvement
        icon: <HomeIcon fontSize="small" />,
        color: 'info',
        progressValue: propertyAvg?.averageScore || 0,
        isScoreValue: true,
        helperText: 'Average score of all properties in the system',
        onClick: () => navigate('/scores/properties')
      },
      {
        title: 'Agent Performance',
        value: agentAvg?.averageScore || 0,
        previousValue: (agentAvg?.averageScore || 0) * 0.98, // Simulate a 2% improvement
        icon: <PersonIcon fontSize="small" />,
        color: 'secondary',
        progressValue: agentAvg?.averageScore || 0,
        isScoreValue: true,
        helperText: 'Average performance score of all agents',
        onClick: () => navigate('/scores/agents')
      }
    ];
  };
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Score Dashboard
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchScoreStats();
              fetchTopScores();
            }}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/scores/new')}
            sx={{ mr: 1 }}
          >
            New Score
          </Button>
          
          <IconButton 
            color="primary"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleCreateTestData}>Generate Test Data</MenuItem>
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate('/scores');
            }}>
              View All Scores
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Export Dashboard</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* KPI metrics */}
      <KpiMetricsRow metrics={getKpiMetrics()} loading={loading} />
      
      {/* Main content area */}
      <Box sx={{ mt: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              backgroundColor: activeTab === 0 ? 'primary.main' : 
                             activeTab === 1 ? 'info.main' : 
                             activeTab === 2 ? 'secondary.main' : 'primary.main',
            },
          }}
        >
          <Tab 
            label="Overview" 
            id="dashboard-tab-0" 
            aria-controls="dashboard-tabpanel-0" 
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            label="Leads" 
            id="dashboard-tab-1" 
            aria-controls="dashboard-tabpanel-1" 
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            label="Properties" 
            id="dashboard-tab-2" 
            aria-controls="dashboard-tabpanel-2" 
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            label="Agents" 
            id="dashboard-tab-3" 
            aria-controls="dashboard-tabpanel-3" 
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
        
        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Score Distribution */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Score Distribution
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <ScoreDistributionChart 
                  data={scoreDistributionData} 
                  loading={loading} 
                  height={300} 
                />
              </Paper>
            </Grid>
            
            {/* Selected Score Details */}
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '100%' }}>
                <ScoreDetailsPanel score={selectedScore || topLeads[0]} loading={loading} />
              </Box>
            </Grid>
            
            {/* Score Trends */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Score Trends (Last 6 Months)
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <ScoreTrendChart 
                  data={scoreTrendData} 
                  loading={loading} 
                  height={300} 
                />
              </Paper>
            </Grid>
            
            {/* Lead Status Distribution */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Lead Status Distribution
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <StatusDistributionChart 
                  data={leadStatusData} 
                  loading={loading} 
                  height={300}
                  nameKey="status"
                />
              </Paper>
            </Grid>
            
            {/* Property Type Distribution */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Property Types by Score
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <MetricComparisonChart 
                  data={propertyTypeData} 
                  loading={loading} 
                  height={300}
                  nameKey="type"
                  valueKey="value"
                  scoreKey="score"
                  showScore={true}
                  scoreUnit="pts"
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Leads Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography>Lead metrics and KPIs will be implemented here</Typography>
        </TabPanel>
        
        {/* Properties Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography>Property metrics and KPIs will be implemented here</Typography>
        </TabPanel>
        
        {/* Agents Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography>Agent metrics and KPIs will be implemented here</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ScoreDashboardPage;