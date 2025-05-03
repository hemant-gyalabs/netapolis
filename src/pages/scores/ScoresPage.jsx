import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Tab, 
  Tabs, 
  Card, 
  CardContent, 
  Divider, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { scoreService } from '../../services/score.service';
import ScoreOverview from '../../components/scores/ScoreOverview';
import LeadScoresTab from '../../components/scores/LeadScoresTab';
import PropertyScoresTab from '../../components/scores/PropertyScoresTab';
import AgentScoresTab from '../../components/scores/AgentScoresTab';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`score-tabpanel-${index}`}
      aria-labelledby={`score-tab-${index}`}
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

// Main component
const ScoresPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreStats, setScoreStats] = useState(null);
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
      await scoreService.createTestScores();
      fetchScoreStats();
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
      const response = await scoreService.getScoreStats();
      setScoreStats(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch score statistics: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchScoreStats();
  }, []);
  
  return (
    <Box>
      {/* Page heading */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Score Tracking System
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchScoreStats}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<FilterListIcon />}
            sx={{ mr: 1 }}
          >
            Filters
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/scores/new')}
          >
            New Score
          </Button>
          <IconButton 
            color="primary"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleCreateTestData}>Create Test Data</MenuItem>
            <MenuItem onClick={handleMenuClose}>Export as CSV</MenuItem>
            <MenuItem onClick={handleMenuClose}>Print Report</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading state */}
      {loading && !scoreStats && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Score statistics cards */}
      {scoreStats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Lead scores card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                Lead Scores
              </Typography>
              
              {scoreStats.averageScores.find(item => item._id === 'lead') ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {scoreStats.averageScores.find(item => item._id === 'lead')?.averageScore.toFixed(1) || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'lead')?.count || 0} Total Leads`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'lead')?.highScores || 0} High Scores`}
                      size="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'lead')?.lowScores || 0} Low Scores`}
                      size="small"
                      color="error"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate('/scores/leads')}
                    >
                      View Details
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    No lead score data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Property scores card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
                Property Scores
              </Typography>
              
              {scoreStats.averageScores.find(item => item._id === 'property') ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {scoreStats.averageScores.find(item => item._id === 'property')?.averageScore.toFixed(1) || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'property')?.count || 0} Total Properties`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'property')?.highScores || 0} High Scores`}
                      size="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'property')?.lowScores || 0} Low Scores`}
                      size="small"
                      color="error"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate('/scores/properties')}
                    >
                      View Details
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    No property score data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Agent scores card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="info.main" sx={{ mb: 1 }}>
                Agent Scores
              </Typography>
              
              {scoreStats.averageScores.find(item => item._id === 'agent') ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {scoreStats.averageScores.find(item => item._id === 'agent')?.averageScore.toFixed(1) || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'agent')?.count || 0} Total Agents`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'agent')?.highScores || 0} High Performers`}
                      size="small"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${scoreStats.averageScores.find(item => item._id === 'agent')?.lowScores || 0} Low Performers`}
                      size="small"
                      color="error"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate('/scores/agents')}
                    >
                      View Details
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    No agent score data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Score tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="score tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: activeTab === 0 ? 'primary.main' : 
                             activeTab === 1 ? 'secondary.main' : 
                             activeTab === 2 ? 'info.main' : 'primary.main',
            },
          }}
        >
          <Tab 
            label="Overview" 
            id="score-tab-0" 
            aria-controls="score-tabpanel-0" 
            sx={{ 
              fontWeight: 600,
              color: activeTab === 0 ? 'primary.main' : 'inherit',
            }}
          />
          <Tab 
            label="Lead Scores" 
            id="score-tab-1" 
            aria-controls="score-tabpanel-1" 
            sx={{ 
              fontWeight: 600,
              color: activeTab === 1 ? 'secondary.main' : 'inherit',
            }}
          />
          <Tab 
            label="Property Scores" 
            id="score-tab-2" 
            aria-controls="score-tabpanel-2" 
            sx={{ 
              fontWeight: 600,
              color: activeTab === 2 ? 'info.main' : 'inherit',
            }}
          />
          <Tab 
            label="Agent Scores" 
            id="score-tab-3" 
            aria-controls="score-tabpanel-3" 
            sx={{ 
              fontWeight: 600,
              color: activeTab === 3 ? 'success.main' : 'inherit',
            }}
          />
        </Tabs>
      </Box>
      
      {/* Tab content */}
      <TabPanel value={activeTab} index={0}>
        <ScoreOverview 
          loading={loading} 
          scoreStats={scoreStats} 
          onRefresh={fetchScoreStats} 
        />
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <LeadScoresTab />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <PropertyScoresTab />
      </TabPanel>
      
      <TabPanel value={activeTab} index={3}>
        <AgentScoresTab />
      </TabPanel>
    </Box>
  );
};

export default ScoresPage;