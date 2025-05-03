import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  CardContent,
  Card,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondary,
  Tooltip,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  DomainAdd as DomainAddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EventBusy as EventBusyIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
  Business as BusinessIcon,
  Speed as SpeedIcon,
  PieChart as PieChartIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { projectService } from '../../services/project.service';
import { formatCurrency } from './ProjectHelpers';
import { createTestProjects } from '../../utils/createTestData';

// Stat card component
const StatCard = ({ title, value, icon, color, trend, trendValue, helperText }) => {
  return (
    <Card 
      sx={{
        height: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.main`,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h4" component="div" gutterBottom fontWeight="bold">
          {value}
        </Typography>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trend === 'up' ? (
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
            )}
            <Typography 
              variant="body2" 
              color={trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 500, mr: 1 }}
            >
              {trendValue}
            </Typography>
            {helperText && (
              <Typography variant="body2" color="text.secondary">
                {helperText}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main project dashboard component
const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get projects
      const projectsResponse = await projectService.getAllProjects({
        limit: 50, // Get more projects for better stats
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });
      
      // Get project stats
      const statsResponse = await projectService.getProjectStats();
      
      // Get user's tasks
      const tasksResponse = await projectService.getMyTasks();
      
      setProjects(projectsResponse.data.projects);
      setStats(statsResponse.data);
      setTasks(tasksResponse.data.tasks);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Create test data
  const handleCreateTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.createTestProjects();
      
      // Reload dashboard data
      await loadDashboardData();
      
      // Show success message
      alert("Test projects created successfully!");
    } catch (err) {
      setError('Failed to create test projects. Please try again later.');
      console.error('Error creating test projects:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate basic statistics
  const calculateStats = () => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        overdueProjects: 0,
        totalBudget: 0,
        totalSpent: 0,
        averageProgress: 0,
        projectsByStatus: {},
        projectsByType: {},
        overdueTasks: 0
      };
    }
    
    const today = new Date();
    
    const result = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'inProgress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      overdueProjects: projects.filter(p => {
        const endDate = new Date(p.endDate);
        return endDate < today && p.status !== 'completed' && p.status !== 'canceled';
      }).length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget.total, 0),
      totalSpent: projects.reduce((sum, p) => sum + p.budget.spent, 0),
      averageProgress: Math.round(
        projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
      ),
      overdueTasks: 0
    };
    
    // Count overdue tasks
    let overdueTasks = 0;
    projects.forEach(project => {
      project.tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        if (dueDate < today && task.status !== 'done') {
          overdueTasks++;
        }
      });
    });
    result.overdueTasks = overdueTasks;
    
    return result;
  };
  
  const dashboardStats = calculateStats();
  
  // Prepare chart data for status distribution
  const getStatusChartData = () => {
    const labels = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Canceled'];
    const statusCounts = stats?.statusStats || [];
    
    const data = labels.map(label => {
      const statusKey = label.toLowerCase().replace(/\s/g, '');
      const statItem = statusCounts.find(item => item._id === statusKey);
      return statItem ? statItem.count : 0;
    });
    
    return labels.map((label, index) => ({
      name: label,
      value: data[index]
    }));
  };
  
  // Prepare chart data for property type distribution
  const getPropertyTypeChartData = () => {
    const labels = ['Residential', 'Commercial', 'Mixed Use', 'Land'];
    const typeCounts = stats?.typeStats || [];
    
    const data = labels.map(label => {
      const typeKey = label.toLowerCase().replace(/\s/g, '');
      const statItem = typeCounts.find(item => item._id === typeKey);
      return statItem ? statItem.count : 0;
    });
    
    return labels.map((label, index) => ({
      name: label,
      value: data[index]
    }));
  };
  
  // Prepare chart data for task status distribution
  const getTaskStatusChartData = () => {
    const labels = ['To Do', 'In Progress', 'Review', 'Completed'];
    const taskCounts = stats?.taskStats || [];
    
    const data = labels.map(label => {
      const statusKey = label.toLowerCase().replace(/\s/g, '');
      const statItem = taskCounts.find(item => item._id === statusKey);
      return statItem ? statItem.count : 0;
    });
    
    return labels.map((label, index) => ({
      name: label,
      value: data[index]
    }));
  };
  
  // Prepare chart data for budget vs spent
  const getBudgetChartData = () => {
    // Get most recent 5 projects with non-zero budget
    const recentProjects = [...projects]
      .filter(p => p.budget.total > 0)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    
    return recentProjects.map(project => ({
      name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
      budget: Math.round(project.budget.total / 100000), // Convert to lakhs
      spent: Math.round(project.budget.spent / 100000) // Convert to lakhs
    }));
  };
  
  // Prepare chart data for progress over time (simulation)
  const getProgressChartData = () => {
    // Simulate monthly progress data for the current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate random progress data with an upward trend
    let lastValue = 30 + Math.random() * 20;
    const progressData = [];
    
    for (let i = 0; i <= currentMonth; i++) {
      // Add some randomness to the progress
      const change = Math.random() * 15 - 5;
      lastValue = Math.min(98, Math.max(40, lastValue + change));
      
      progressData.push({
        month: months[i],
        progress: Math.round(lastValue)
      });
    }
    
    return progressData;
  };
  
  // Colors for charts
  const statusColors = ['#3f51b5', '#4caf50', '#ff9800', '#00c853', '#f44336'];
  const typeColors = ['#9c27b0', '#03a9f4', '#00bcd4', '#8bc34a'];
  const taskColors = ['#9e9e9e', '#2196f3', '#9c27b0', '#4caf50'];
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Dashboard header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Project Dashboard
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleCreateTestData}
            sx={{ mr: 2 }}
          >
            Generate Test Data
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </Box>
      </Box>
      
      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value={dashboardStats.totalProjects}
            icon={<BusinessIcon />}
            color="primary"
            trend="up"
            trendValue="+12%"
            helperText="vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={dashboardStats.activeProjects}
            icon={<TrendingUpIcon />}
            color="success"
            trend="up"
            trendValue="+5%"
            helperText="vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Projects"
            value={dashboardStats.overdueProjects}
            icon={<EventBusyIcon />}
            color="error"
            trend={dashboardStats.overdueProjects > 2 ? "up" : "down"}
            trendValue={dashboardStats.overdueProjects > 2 ? "+2" : "-1"}
            helperText="vs last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Progress"
            value={`${dashboardStats.averageProgress}%`}
            icon={<SpeedIcon />}
            color="info"
            trend="up"
            trendValue="+8%"
            helperText="vs last month"
          />
        </Grid>
      </Grid>
      
      {/* Charts and metrics */}
      <Grid container spacing={3}>
        {/* Project status distribution */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            sx={{
              p: 3,
              height: 350,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Project Status Distribution
            </Typography>
            
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getStatusChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Property type distribution */}
        <Grid item xs={12} md={4} lg={4}>
          <Paper
            sx={{
              p: 3,
              height: 350,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Property Type Distribution
            </Typography>
            
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPropertyTypeChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPropertyTypeChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={typeColors[index % typeColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Task status distribution */}
        <Grid item xs={12} md={3} lg={4}>
          <Paper
            sx={{
              p: 3,
              height: 350,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Task Status Distribution
            </Typography>
            
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTaskStatusChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getTaskStatusChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={taskColors[index % taskColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Budget chart */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 3,
              height: 350,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Budget vs Spent (Recent Projects in Lakhs)
            </Typography>
            
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getBudgetChartData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#3f51b5" />
                  <Bar dataKey="spent" name="Spent" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Progress over time */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 3,
              height: 350,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Progress Trend (This Year)
            </Typography>
            
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getProgressChartData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    name="Avg. Progress"
                    stroke="#ff5722"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Financial overview */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Financial Overview
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Budget (All Projects)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {formatCurrency(dashboardStats.totalBudget)}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Spent
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {formatCurrency(dashboardStats.totalSpent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round((dashboardStats.totalSpent / dashboardStats.totalBudget) * 100)}% of budget
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Average Budget per Project
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {formatCurrency(dashboardStats.totalProjects ? dashboardStats.totalBudget / dashboardStats.totalProjects : 0)}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Remaining Budget
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {formatCurrency(dashboardStats.totalBudget - dashboardStats.totalSpent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(((dashboardStats.totalBudget - dashboardStats.totalSpent) / dashboardStats.totalBudget) * 100)}% remaining
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* My tasks */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  My Tasks
                </Typography>
              </Box>
              
              <Button
                size="small"
                onClick={() => navigate('/projects/my-tasks')}
              >
                View All
              </Button>
            </Box>
            
            {tasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  You have no assigned tasks.
                </Typography>
              </Box>
            ) : (
              <List>
                {tasks.slice(0, 5).map(task => (
                  <ListItem
                    key={task._id}
                    sx={{
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                      mb: 1
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => navigate(`/projects/${task.projectId}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: task.status === 'done'
                            ? 'success.light'
                            : task.status === 'inProgress'
                            ? 'primary.light'
                            : task.status === 'review'
                            ? 'secondary.light'
                            : 'grey.300'
                        }}
                      >
                        {task.status === 'done' ? (
                          <CheckCircleIcon />
                        ) : task.status === 'inProgress' ? (
                          <TrendingUpIcon />
                        ) : task.status === 'review' ? (
                          <AssignmentIcon />
                        ) : (
                          <ScheduleIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={task.name}
                      secondary={
                        <Box>
                          <Typography variant="caption" component="span">
                            {task.projectName} • Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Project overview */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Recent Projects
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/projects')}
              >
                View All Projects
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {projects.slice(0, 4).map(project => (
                <Grid item xs={12} sm={6} md={3} key={project._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                      }
                    }}
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Chip
                          label={project.status === 'planning'
                            ? 'Planning'
                            : project.status === 'inProgress'
                            ? 'In Progress'
                            : project.status === 'onHold'
                            ? 'On Hold'
                            : project.status === 'completed'
                            ? 'Completed'
                            : 'Canceled'
                          }
                          color={project.status === 'planning'
                            ? 'info'
                            : project.status === 'inProgress'
                            ? 'primary'
                            : project.status === 'onHold'
                            ? 'warning'
                            : project.status === 'completed'
                            ? 'success'
                            : 'error'
                          }
                          size="small"
                        />
                        
                        <Chip
                          label={project.propertyType === 'residential'
                            ? 'Residential'
                            : project.propertyType === 'commercial'
                            ? 'Commercial'
                            : project.propertyType === 'mixed'
                            ? 'Mixed Use'
                            : 'Land'
                          }
                          color={project.propertyType === 'residential'
                            ? 'primary'
                            : project.propertyType === 'commercial'
                            ? 'secondary'
                            : project.propertyType === 'mixed'
                            ? 'info'
                            : 'success'
                          }
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          height: 48
                        }}
                      >
                        {project.name}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {project.location.area}, {project.location.city}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Progress
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3
                              }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {project.progress}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {project.team.length} members
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {project.tasks.length} tasks
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDashboard;