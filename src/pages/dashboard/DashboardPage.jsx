import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Chip,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  Legend 
} from 'recharts';

// Demo data for charts
const projectStatusData = [
  { name: 'Planning', value: 3 },
  { name: 'In Progress', value: 4 },
  { name: 'On Hold', value: 1 },
  { name: 'Completed', value: 2 },
];

const taskCompletionData = [
  { name: 'Jan', completed: 5, total: 8 },
  { name: 'Feb', completed: 7, total: 10 },
  { name: 'Mar', completed: 10, total: 12 },
  { name: 'Apr', completed: 15, total: 18 },
  { name: 'May', completed: 12, total: 15 },
  { name: 'Jun', completed: 18, total: 20 },
  { name: 'Jul', completed: 20, total: 22 },
];

const leadsData = [
  { name: 'Week 1', leads: 15, conversions: 3 },
  { name: 'Week 2', leads: 18, conversions: 4 },
  { name: 'Week 3', leads: 22, conversions: 6 },
  { name: 'Week 4', leads: 25, conversions: 8 },
  { name: 'Week 5', leads: 30, conversions: 9 },
];

const agentPerformanceData = [
  { name: 'Raj', score: 85 },
  { name: 'Priya', score: 92 },
  { name: 'Amir', score: 78 },
  { name: 'Sara', score: 90 },
  { name: 'Vikram', score: 88 },
];

const propertyScoreData = [
  { name: 'Kokapet', score: 92 },
  { name: 'Narsingi', score: 88 },
  { name: 'Manchirevula', score: 75 },
  { name: 'Tellapur', score: 85 },
  { name: 'Kollur', score: 78 },
];

// Recent projects data
const recentProjects = [
  {
    id: 1,
    name: 'Residential Complex - Kokapet',
    status: 'inProgress',
    progress: 65,
    deadline: '2025-08-15',
    manager: 'Amir Khan',
    budget: {
      total: 8500000,
      spent: 5525000
    }
  },
  {
    id: 2,
    name: 'Commercial Plaza - Narsingi',
    status: 'planning',
    progress: 30,
    deadline: '2025-12-01',
    manager: 'Priya Sharma',
    budget: {
      total: 12000000,
      spent: 3600000
    }
  },
  {
    id: 3,
    name: 'Land Development - Manchirevula',
    status: 'onHold',
    progress: 45,
    deadline: '2025-10-30',
    manager: 'Raj Patel',
    budget: {
      total: 5000000,
      spent: 2250000
    }
  },
  {
    id: 4,
    name: 'Mixed-Use Development - Tellapur',
    status: 'completed',
    progress: 100,
    deadline: '2025-04-15',
    manager: 'Sara Reddy',
    budget: {
      total: 15000000,
      spent: 14850000
    }
  }
];

// Recent leads data
const recentLeads = [
  {
    id: 1,
    name: 'Arjun Mehta',
    email: 'arjun.m@example.com',
    phone: '+91 9876543210',
    status: 'qualified',
    score: 85,
    interestedIn: 'Residential Property - Kokapet',
    assignedTo: 'Priya Sharma',
    createdAt: '2025-04-28T10:30:00'
  },
  {
    id: 2,
    name: 'Neha Gupta',
    email: 'neha.g@example.com',
    phone: '+91 9765432109',
    status: 'new',
    score: 65,
    interestedIn: 'Commercial Space - Narsingi',
    assignedTo: 'Raj Patel',
    createdAt: '2025-05-01T14:45:00'
  },
  {
    id: 3,
    name: 'Suresh Kumar',
    email: 'suresh.k@example.com',
    phone: '+91 9654321098',
    status: 'contacted',
    score: 72,
    interestedIn: 'Land Plot - Manchirevula',
    assignedTo: 'Amir Khan',
    createdAt: '2025-05-02T09:15:00'
  }
];

// Styling
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    planning: {
      bg: theme.palette.info.light,
      color: theme.palette.info.dark
    },
    inProgress: {
      bg: theme.palette.primary.light,
      color: theme.palette.primary.dark
    },
    onHold: {
      bg: theme.palette.warning.light,
      color: theme.palette.warning.dark
    },
    completed: {
      bg: theme.palette.success.light,
      color: theme.palette.success.dark
    },
    new: {
      bg: theme.palette.info.light,
      color: theme.palette.info.dark
    },
    contacted: {
      bg: theme.palette.primary.light,
      color: theme.palette.primary.dark
    },
    qualified: {
      bg: theme.palette.success.light,
      color: theme.palette.success.dark
    },
    negotiation: {
      bg: theme.palette.warning.light,
      color: theme.palette.warning.dark
    },
    closed: {
      bg: theme.palette.success.dark,
      color: theme.palette.common.white
    },
    lost: {
      bg: theme.palette.error.light,
      color: theme.palette.error.dark
    }
  };

  const statusColor = colors[status] || colors.planning;

  return {
    backgroundColor: statusColor.bg,
    color: statusColor.color,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

// Dashboard page component
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // COLORS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const SECONDARY_COLORS = ['#081d4a', '#283655', '#4D648D', '#337CCF', '#1D5B79'];
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate days left
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Get status display name
  const getStatusDisplayName = (status) => {
    const statusMap = {
      planning: 'Planning',
      inProgress: 'In Progress',
      onHold: 'On Hold',
      completed: 'Completed',
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      negotiation: 'Negotiation',
      closed: 'Closed',
      lost: 'Lost'
    };
    
    return statusMap[status] || status;
  };
  
  // Get time passed
  const getTimePassed = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Handle card click
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };
  
  const handleLeadClick = (leadId) => {
    navigate(`/scores/leads`);
  };
  
  return (
    <Box>
      {/* Page heading */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
            sx={{ mr: 1 }}
          >
            New Project
          </Button>
        </Box>
      </Box>
      
      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Projects
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                <BusinessIcon sx={{ fontSize: 18, color: 'primary.dark' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                10
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 0.5 }}>
                <ArrowUpwardIcon color="success" sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  25%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              vs previous month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                New Leads
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: 'success.dark' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                36
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 0.5 }}>
                <ArrowUpwardIcon color="success" sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  12%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              vs previous month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Team Members
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Avatar sx={{ bgcolor: 'info.light', width: 32, height: 32 }}>
                <PeopleIcon sx={{ fontSize: 18, color: 'info.dark' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                24
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 0.5 }}>
                <ArrowUpwardIcon color="success" sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  4%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              vs previous month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 120,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Avg Property Score
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                <AssessmentIcon sx={{ fontSize: 18, color: 'secondary.dark' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                83.6
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 0.5 }}>
                <ArrowDownwardIcon color="error" sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                  2%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              vs previous month
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <StyledCardHeader
              title="Task Completion Trend"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <Box sx={{ height: 300, pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stackId="1" 
                    stroke="#081d4a" 
                    fill="#081d4a" 
                    fillOpacity={0.5} 
                    name="Total Tasks"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="2" 
                    stroke="#ff6600" 
                    fill="#ff6600" 
                    fillOpacity={0.5} 
                    name="Completed Tasks"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <StyledCardHeader
              title="Project Status"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <Box sx={{ height: 300, pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <StyledCardHeader
              title="Lead Generation & Conversion"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <Box sx={{ height: 300, pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#081d4a" 
                    activeDot={{ r: 8 }} 
                    name="New Leads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#ff6600" 
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <StyledCardHeader
              title="Property Score Comparison"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <Box sx={{ height: 300, pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Bar dataKey="score" name="Property Score">
                    {propertyScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SECONDARY_COLORS[index % SECONDARY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Projects */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              p: 2
            }}>
              <Typography variant="h6">Recent Projects</Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="small"
                onClick={() => navigate('/projects')}
              >
                View All
              </Button>
            </Box>
            <Divider />
            <List sx={{ p: 0 }}>
              {recentProjects.map((project, index) => (
                <Box key={project.id}>
                  <ListItem 
                    sx={{ py: 2, cursor: 'pointer' }}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {project.name}
                        </Typography>
                        <StatusChip
                          label={getStatusDisplayName(project.status)}
                          status={project.status}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 5,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: project.progress === 100 ? 'success.main' : 'primary.main',
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {project.progress}% Complete
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.total)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            Deadline: {formatDate(project.deadline)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Manager: {project.manager}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < recentProjects.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Recent Leads */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
              p: 2
            }}>
              <Typography variant="h6">Recent Leads</Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                onClick={() => navigate('/scores/leads')}
              >
                View All
              </Button>
            </Box>
            <Divider />
            <List sx={{ p: 0 }}>
              {recentLeads.map((lead, index) => (
                <Box key={lead.id}>
                  <ListItem 
                    sx={{ py: 2, cursor: 'pointer' }}
                    onClick={() => handleLeadClick(lead.id)}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 2,
                              bgcolor: 'primary.main'
                            }}
                          >
                            {lead.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {lead.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.email} | {lead.phone}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <StatusChip
                            label={getStatusDisplayName(lead.status)}
                            status={lead.status}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                          <Tooltip title="Lead Score">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" fontWeight={600} mr={0.5}>
                                Score:
                              </Typography>
                              <Chip 
                                label={lead.score}
                                size="small"
                                sx={{ 
                                  backgroundColor: lead.score >= 80 ? 'success.light' : 
                                                  lead.score >= 60 ? 'primary.light' : 
                                                  'warning.light',
                                  color: lead.score >= 80 ? 'success.dark' : 
                                         lead.score >= 60 ? 'primary.dark' : 
                                         'warning.dark',
                                  fontWeight: 600,
                                  height: 20,
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {lead.interestedIn}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            Added {getTimePassed(lead.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Assigned to: {lead.assignedTo}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < recentLeads.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;