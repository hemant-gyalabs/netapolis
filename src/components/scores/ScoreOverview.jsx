import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { scoreService } from '../../services/score.service';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format score value
const formatScore = (score) => {
  if (!score && score !== 0) return 'N/A';
  return score.toFixed(1);
};

// Get a score color based on value
const getScoreColor = (score) => {
  if (score >= 80) return 'success.main';
  if (score >= 60) return 'primary.main';
  if (score >= 40) return 'warning.main';
  return 'error.main';
};

// Score indicator component
const ScoreIndicator = ({ score, size = 'medium' }) => {
  const color = getScoreColor(score);
  const fontSizes = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem'
  };
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size === 'small' ? 36 : size === 'medium' ? 46 : 56,
        height: size === 'small' ? 36 : size === 'medium' ? 46 : 56,
        borderRadius: '50%',
        bgcolor: color,
        color: '#fff',
        fontWeight: 600,
        fontSize: fontSizes[size]
      }}
    >
      {formatScore(score)}
    </Box>
  );
};

// Main component
const ScoreOverview = ({ loading, scoreStats, onRefresh }) => {
  const navigate = useNavigate();
  const [topLeads, setTopLeads] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Constants for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const SECONDARY_COLORS = ['#081d4a', '#283655', '#4D648D', '#337CCF', '#1D5B79'];
  
  // Fetch top scores
  const fetchTopScores = async () => {
    try {
      setLoadingMore(true);
      
      // Fetch top leads
      const leadsResponse = await scoreService.getTopScores('lead', 5);
      setTopLeads(leadsResponse.data.scores);
      
      // Fetch top properties
      const propertiesResponse = await scoreService.getTopScores('property', 5);
      setTopProperties(propertiesResponse.data.scores);
      
      // Fetch top agents
      const agentsResponse = await scoreService.getTopScores('agent', 5);
      setTopAgents(agentsResponse.data.scores);
    } catch (error) {
      console.error('Failed to fetch top scores:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Load top scores on mount
  useEffect(() => {
    fetchTopScores();
  }, []);
  
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
  
  // Format conversion stats for chart
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
      value: item.count
    }));
  };
  
  // Format property stats for chart
  const formatPropertyStats = (data) => {
    if (!data) return [];
    
    // Map property type to readable names
    const typeMap = {
      residential: 'Residential',
      commercial: 'Commercial',
      land: 'Land',
      mixed: 'Mixed Use'
    };
    
    return data.map(item => ({
      type: typeMap[item._id] || item._id,
      value: item.count,
      score: item.averageScore
    }));
  };
  
  // Score distribution chart
  const scoreDistributionData = formatScoreDistribution(scoreStats?.scoreDistribution);
  
  // Score trend chart
  const scoreTrendData = formatScoreTrend(scoreStats?.scoreTrend);
  
  // Lead conversion chart
  const leadConversionData = formatLeadConversionStats(scoreStats?.leadStats);
  
  // Property type chart
  const propertyTypeData = formatPropertyStats(scoreStats?.propertyStats);
  
  return (
    <Box>
      {/* Score distribution chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
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
              <Typography variant="h6">Score Distribution</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {loading || !scoreStats ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={scoreDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lead" name="Lead Scores" fill="#FF8042" />
                    <Bar dataKey="property" name="Property Scores" fill="#0088FE" />
                    <Bar dataKey="agent" name="Agent Scores" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
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
              <Typography variant="h6">Score Summary</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {loading || !scoreStats ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Box sx={{ height: 300, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {scoreStats.averageScores.map((item, index) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 3,
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: COLORS[index % COLORS.length],
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {item._id.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item._id.charAt(0).toUpperCase() + item._id.slice(1)} Scores
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.count} total, {item.highScores} high, {item.lowScores} low
                        </Typography>
                      </Box>
                    </Box>
                    <ScoreIndicator score={item.averageScore} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Score trends */}
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
          <Typography variant="h6">Score Trends (Last 6 Months)</Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {loading || !scoreStats ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={scoreTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lead" name="Lead Scores" stroke="#FF8042" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="property" name="Property Scores" stroke="#0088FE" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="agent" name="Agent Scores" stroke="#00C49F" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
      
      {/* Top scores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardHeader
              title="Top Lead Scores"
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            
            <CardContent sx={{ p: 0 }}>
              {loadingMore ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" height={20} />
                      </Box>
                      <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
                    </Box>
                  ))}
                </Box>
              ) : topLeads.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No lead score data available
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Lead</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topLeads.map((lead) => (
                        <TableRow
                          key={lead._id}
                          hover
                          onClick={() => navigate(`/scores/leads/${lead._id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 30, height: 30, mr: 1, fontSize: '0.875rem' }}>
                                {lead.leadDetails?.name?.charAt(0) || 'L'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {lead.leadDetails?.name || 'Unknown Lead'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {lead.leadDetails?.email || ''}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={lead.leadDetails?.status?.charAt(0).toUpperCase() + lead.leadDetails?.status?.slice(1) || 'Unknown'}
                              size="small"
                              color={
                                lead.leadDetails?.status === 'qualified' || lead.leadDetails?.status === 'closed' ? 'success' :
                                lead.leadDetails?.status === 'negotiation' ? 'primary' :
                                lead.leadDetails?.status === 'contacted' ? 'info' :
                                lead.leadDetails?.status === 'lost' ? 'error' :
                                'default'
                              }
                              sx={{ height: 20 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <ScoreIndicator score={lead.score} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/scores/leads')}
              >
                View All Leads
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardHeader
              title="Top Property Scores"
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            
            <CardContent sx={{ p: 0 }}>
              {loadingMore ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" height={20} />
                      </Box>
                      <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
                    </Box>
                  ))}
                </Box>
              ) : topProperties.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No property score data available
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProperties.map((property) => (
                        <TableRow
                          key={property._id}
                          hover
                          onClick={() => navigate(`/scores/properties/${property._id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 30, height: 30, mr: 1, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                                {property.propertyDetails?.name?.charAt(0) || 'P'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {property.propertyDetails?.name || 'Unknown Property'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {property.propertyDetails?.location?.area || ''}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.propertyDetails?.type?.charAt(0).toUpperCase() + property.propertyDetails?.type?.slice(1) || 'Unknown'}
                              size="small"
                              color={
                                property.propertyDetails?.type === 'residential' ? 'info' :
                                property.propertyDetails?.type === 'commercial' ? 'secondary' :
                                property.propertyDetails?.type === 'land' ? 'success' :
                                'default'
                              }
                              sx={{ height: 20 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <ScoreIndicator score={property.score} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/scores/properties')}
              >
                View All Properties
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardHeader
              title="Top Agent Scores"
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            
            <CardContent sx={{ p: 0 }}>
              {loadingMore ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" height={20} />
                      </Box>
                      <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
                    </Box>
                  ))}
                </Box>
              ) : topAgents.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No agent score data available
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Agent</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topAgents.map((agent) => (
                        <TableRow
                          key={agent._id}
                          hover
                          onClick={() => navigate(`/scores/agents/${agent._id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 30, height: 30, mr: 1, bgcolor: 'info.main', fontSize: '0.875rem' }}>
                                {agent.agentDetails?.user?.firstName?.charAt(0) || 'A'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {agent.agentDetails?.user ? 
                                   `${agent.agentDetails.user.firstName} ${agent.agentDetails.user.lastName}` : 
                                   'Unknown Agent'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {agent.agentDetails?.user?.email || ''}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Conv. Rate: {agent.agentDetails?.performance?.conversionRate || 0}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={agent.agentDetails?.performance?.conversionRate || 0} 
                                sx={{ height: 4, mt: 0.5 }}
                                color={
                                  (agent.agentDetails?.performance?.conversionRate || 0) >= 70 ? 'success' :
                                  (agent.agentDetails?.performance?.conversionRate || 0) >= 40 ? 'primary' :
                                  'error'
                                }
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <ScoreIndicator score={agent.score} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/scores/agents')}
              >
                View All Agents
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Additional charts */}
      <Grid container spacing={3}>
        {/* Lead conversion chart */}
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
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {loading || !scoreStats ? (
              <Skeleton variant="rectangular" height={300} />
            ) : leadConversionData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No lead conversion data available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={leadConversionData}
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
                      {leadConversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Property type chart */}
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
              <Typography variant="h6">Property Types by Score</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {loading || !scoreStats ? (
              <Skeleton variant="rectangular" height={300} />
            ) : propertyTypeData.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No property type data available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={propertyTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#ff8042" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="value" name="Count" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="score" name="Avg. Score" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScoreOverview;