import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Divider,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { scoreService } from '../../services/score.service';
import LeadScoresTab from '../../components/scores/LeadScoresTab';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const LeadsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leadStats, setLeadStats] = useState(null);
  const [leadConversions, setLeadConversions] = useState(null);
  const [error, setError] = useState(null);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000'];
  
  // Format lead conversion stats for chart
  const formatLeadConversionStats = (data) => {
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
  
  // Format conversion by source for chart
  const formatConversionBySource = (data) => {
    if (!data) return [];
    
    // Map source to readable names
    const sourceMap = {
      website: 'Website',
      referral: 'Referral',
      social: 'Social Media',
      advertisement: 'Advertisement',
      direct: 'Direct Contact'
    };
    
    return data.map(item => ({
      source: sourceMap[item.source] || item.source,
      count: item.count,
      converted: item.converted,
      conversionRate: item.conversionRate.toFixed(1)
    }));
  };
  
  // Format conversion trend for chart
  const formatConversionTrend = (data) => {
    if (!data) return [];
    
    // Get last 6 months
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        monthNum: month.getMonth() + 1,
        year: month.getFullYear()
      });
    }
    
    // Match data with months
    return months.map(month => {
      const result = {
        month: month.month
      };
      
      // Add count for each status
      ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'].forEach(status => {
        const count = data.find(item => 
          item._id.month === month.monthNum && 
          item._id.year === month.year && 
          item._id.status === status
        )?.count || 0;
        
        result[status] = count;
      });
      
      return result;
    });
  };
  
  // Fetch lead statistics
  const fetchLeadStats = async () => {
    try {
      setLoading(true);
      
      // Get lead stats from backend
      const statsResponse = await scoreService.getScoreStats();
      setLeadStats(statsResponse.data);
      
      // Get lead conversion stats
      const conversionsResponse = await scoreService.getLeadConversions();
      setLeadConversions(conversionsResponse.data);
      
      setError(null);
    } catch (error) {
      setError('Failed to fetch lead statistics: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchLeadStats();
  }, []);
  
  // Prepare chart data
  const leadStatusData = formatLeadConversionStats(leadConversions?.conversionStats);
  const conversionBySourceData = formatConversionBySource(leadConversions?.conversionBySource);
  const conversionTrendData = formatConversionTrend(leadConversions?.conversionTrend);
  
  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lead Management
        </Typography>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchLeadStats}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/scores/leads/new')}
          >
            New Lead
          </Button>
        </Box>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Statistics section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Lead conversion charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Lead status distribution */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Lead Status Distribution</Typography>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {!leadStatusData || leadStatusData.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Typography variant="body2" color="text.secondary">
                      No lead status data available
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={leadStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="status"
                          label
                        >
                          {leadStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [value, name]}
                          labelFormatter={() => ''}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Conversion by source */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Lead Conversion by Source</Typography>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {!conversionBySourceData || conversionBySourceData.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Typography variant="body2" color="text.secondary">
                      No conversion data available
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer>
                      <BarChart data={conversionBySourceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="source" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Total Leads" fill="#8884d8" />
                        <Bar yAxisId="left" dataKey="converted" name="Converted" fill="#82ca9d" />
                        <Bar yAxisId="right" dataKey="conversionRate" name="Conversion Rate (%)" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Conversion trend over time */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Lead Conversion Trend (Last 6 Months)</Typography>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {!conversionTrendData || conversionTrendData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No trend data available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={conversionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="new" name="New" stroke="#8884d8" />
                    <Line type="monotone" dataKey="contacted" name="Contacted" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="qualified" name="Qualified" stroke="#ff8042" />
                    <Line type="monotone" dataKey="negotiation" name="Negotiation" stroke="#00C49F" />
                    <Line type="monotone" dataKey="closed" name="Closed" stroke="#0088FE" />
                    <Line type="monotone" dataKey="lost" name="Lost" stroke="#FF0000" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </>
      )}
      
      {/* Lead scores list */}
      <LeadScoresTab />
    </Box>
  );
};

export default LeadsPage;