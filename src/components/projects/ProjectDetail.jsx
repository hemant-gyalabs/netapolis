import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Tooltip,
  Breadcrumbs,
  Link,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  Bookmark as BookmarkIcon,
  Flag as FlagIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  InsertDriveFile as FileIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { projectService } from '../../services/project.service';

// Progress indicator component
const ProgressIndicator = ({ value, size = 'medium', showText = true }) => {
  const getColor = (val) => {
    if (val >= 75) return 'success';
    if (val >= 40) return 'primary';
    if (val >= 20) return 'warning';
    return 'error';
  };
  
  const height = size === 'small' ? 4 : size === 'medium' ? 8 : 12;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: showText ? 1 : 0 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          color={getColor(value)}
          sx={{
            height,
            borderRadius: height / 2,
            backgroundColor: 'grey.200'
          }}
        />
      </Box>
      {showText && (
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {value}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Project status chip component
const ProjectStatusChip = ({ status }) => {
  const statusConfig = {
    planning: { label: 'Planning', color: 'info' },
    inProgress: { label: 'In Progress', color: 'primary' },
    onHold: { label: 'On Hold', color: 'warning' },
    completed: { label: 'Completed', color: 'success' },
    canceled: { label: 'Canceled', color: 'error' }
  };
  
  const config = statusConfig[status] || { label: 'Unknown', color: 'default' };
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
    />
  );
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency for display
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  
  // Format as Indian currency (lakhs and crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

// Format time elapsed
const formatTimeElapsed = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  
  if (diffDays > 30) {
    return formatDate(dateString);
  } else if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffHr === 1) {
    return '1 hour ago';
  } else if (diffHr > 1) {
    return `${diffHr} hours ago`;
  } else if (diffMin === 1) {
    return '1 minute ago';
  } else if (diffMin > 1) {
    return `${diffMin} minutes ago`;
  } else {
    return 'Just now';
  }
};

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
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

// Task status chip component
const TaskStatusChip = ({ status }) => {
  const statusConfig = {
    todo: { label: 'To Do', color: 'default', icon: <HourglassEmptyIcon fontSize="small" /> },
    inProgress: { label: 'In Progress', color: 'primary', icon: <TimelineIcon fontSize="small" /> },
    review: { label: 'Review', color: 'info', icon: <InfoIcon fontSize="small" /> },
    done: { label: 'Done', color: 'success', icon: <CheckCircleIcon fontSize="small" /> }
  };
  
  const config = statusConfig[status] || statusConfig.todo;
  
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant={status === 'todo' ? 'outlined' : 'filled'}
    />
  );
};

// Task priority icon component
const TaskPriorityIcon = ({ priority }) => {
  switch (priority) {
    case 'low':
      return <InfoIcon fontSize="small" color="info" />;
    case 'medium':
      return <WarningIcon fontSize="small" color="primary" />;
    case 'high':
      return <WarningIcon fontSize="small" color="warning" />;
    case 'urgent':
      return <ErrorIcon fontSize="small" color="error" />;
    default:
      return <InfoIcon fontSize="small" color="disabled" />;
  }
};

// Task list component
const TasksList = ({ tasks, onViewTask, onEditTask, onDeleteTask }) => {
  // Sort tasks: first by status (todo, inProgress, review, done), then by priority (urgent, high, medium, low)
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { todo: 0, inProgress: 1, review: 2, done: 3 };
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    // First sort by status
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Then sort by priority
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Calculate if a task is overdue
  const isOverdue = (task) => {
    if (task.status === 'done') return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {sortedTasks.map((task) => (
        <ListItem
          key={task._id}
          disablePadding
          sx={{
            mb: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemButton onClick={() => onViewTask && onViewTask(task)}>
            <ListItemIcon>
              <TaskPriorityIcon priority={task.priority} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" component="span">
                    {task.name}
                  </Typography>
                  {isOverdue(task) && (
                    <Chip
                      label="Overdue"
                      color="error"
                      size="small"
                      sx={{ ml: 1, height: 20 }}
                    />
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.disabled' }} />
                  <Typography variant="caption" component="span" color="text.secondary">
                    {formatDate(task.dueDate)}
                  </Typography>
                  
                  {task.assignedTo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.disabled' }} />
                      <Typography variant="caption" component="span" color="text.secondary">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <TaskStatusChip status={task.status} />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

// Project tasks tab
const TasksTab = ({ project, onAddTask, onEditTask, onDeleteTask }) => {
  // Task statistics
  const taskStats = {
    total: project.tasks.length,
    todo: project.tasks.filter(task => task.status === 'todo').length,
    inProgress: project.tasks.filter(task => task.status === 'inProgress').length,
    review: project.tasks.filter(task => task.status === 'review').length,
    done: project.tasks.filter(task => task.status === 'done').length
  };
  
  return (
    <Box>
      {/* Task statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {taskStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
              {taskStats.todo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To Do
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
              {taskStats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="info.main" gutterBottom>
              {taskStats.review}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Review
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
              {taskStats.done}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Task list */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Tasks
        </Typography>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddTask}
        >
          Add Task
        </Button>
      </Box>
      
      {project.tasks.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" gutterBottom>
            No tasks have been created yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddTask}
            sx={{ mt: 2 }}
          >
            Add First Task
          </Button>
        </Paper>
      ) : (
        <TasksList
          tasks={project.tasks}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </Box>
  );
};

// Team tab
const TeamTab = ({ project }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Project Team
      </Typography>
      
      <Grid container spacing={3}>
        {/* Project manager */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardHeader
              title="Project Manager"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}
                >
                  {project.manager.firstName.charAt(0)}{project.manager.lastName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {project.manager.firstName} {project.manager.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.manager.email}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    Project Manager
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Team members */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardHeader
              title="Team Members"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                >
                  Add Member
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {project.team.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No team members have been added yet.
                </Typography>
              ) : (
                <List sx={{ width: '100%' }}>
                  {project.team.map((member, index) => (
                    <ListItem
                      key={member._id}
                      divider={index < project.team.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${member.firstName} ${member.lastName}`}
                        secondary={member.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Documents tab
const DocumentsTab = ({ project, onAddDocument }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Project Documents
        </Typography>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddDocument}
        >
          Add Document
        </Button>
      </Box>
      
      {project.documents.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" gutterBottom>
            No documents have been uploaded yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddDocument}
            sx={{ mt: 2 }}
          >
            Upload Document
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {project.documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document._id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <FileIcon 
                      color="primary" 
                      sx={{ fontSize: 40, mr: 1.5 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={500} noWrap>
                        {document.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded {formatTimeElapsed(document.uploadedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      By {document.uploadedBy.firstName} {document.uploadedBy.lastName}
                    </Typography>
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// Comments tab
const CommentsTab = ({ project, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Project Comments & Updates
        </Typography>
      </Box>
      
      {/* Comment input */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Add a comment
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Type your comment here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={!newComment.trim()}
            onClick={() => {
              onAddComment(newComment);
              setNewComment('');
            }}
          >
            Post Comment
          </Button>
        </Box>
      </Paper>
      
      {/* Comments list */}
      {project.comments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1">
            No comments have been added yet.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {project.comments.map((comment) => (
            <Paper
              key={comment._id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Avatar
                  sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 2 }}
                >
                  {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {comment.author.firstName} {comment.author.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {formatTimeElapsed(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {comment.text}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Main ProjectDetail component
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  // Load project data
  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.getProjectById(id);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to load project details. Please try again later.');
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load project on mount
  useEffect(() => {
    loadProject();
  }, [id]);
  
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
  
  // Handle edit project
  const handleEditProject = () => {
    navigate(`/projects/${id}/edit`);
    handleMenuClose();
  };
  
  // Handle delete project
  const handleDeleteProject = async () => {
    // In a real app, we would show a confirmation dialog
    if (!window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      handleMenuClose();
      return;
    }
    
    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      setError('Failed to delete project. Please try again later.');
      console.error('Error deleting project:', err);
    }
    
    handleMenuClose();
  };
  
  // Handle add task
  const handleAddTask = () => {
    navigate(`/projects/${id}/tasks/new`);
  };
  
  // Handle add document
  const handleAddDocument = () => {
    navigate(`/projects/${id}/documents/new`);
  };
  
  // Handle add comment
  const handleAddComment = async (text) => {
    try {
      const response = await projectService.addComment(id, text);
      
      // Update the project with the new comment
      setProject({
        ...project,
        comments: [...project.comments, response.data.comment]
      });
    } catch (err) {
      setError('Failed to add comment. Please try again later.');
      console.error('Error adding comment:', err);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  // Show not found state
  if (!project) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Project not found.
      </Alert>
    );
  }
  
  // Calculate days left
  const calculateDaysLeft = () => {
    const today = new Date();
    const endDate = new Date(project.endDate);
    
    const timeDiff = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysLeft;
  };
  
  const daysLeft = calculateDaysLeft();
  
  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            navigate('/projects'); 
          }}
        >
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>
      
      {/* Project header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ProjectStatusChip status={project.status} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Created on {formatDate(project.createdAt)}
              </Typography>
            </Box>
            
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              {project.name}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {project.description}
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 1 }}
              onClick={() => navigate('/projects')}
            >
              Back
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditProject}
            >
              Edit Project
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
              <MenuItem onClick={handleEditProject}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit Project
              </MenuItem>
              <MenuItem onClick={handleDeleteProject}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete Project
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Project stats */}
        <Grid container spacing={3}>
          {/* Location */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationIcon color="primary" sx={{ mt: 0.5, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="subtitle2" fontWeight={500}>
                  {project.location.area}, {project.location.city}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Timeline */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <DateRangeIcon color="primary" sx={{ mt: 0.5, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Timeline
                </Typography>
                <Typography variant="subtitle2" fontWeight={500}>
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Budget */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <AttachMoneyIcon color="primary" sx={{ mt: 0.5, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Budget
                </Typography>
                <Typography variant="subtitle2" fontWeight={500}>
                  {formatCurrency(project.budget.total)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Manager */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <PersonIcon color="primary" sx={{ mt: 0.5, mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Project Manager
                </Typography>
                <Typography variant="subtitle2" fontWeight={500}>
                  {project.manager.firstName} {project.manager.lastName}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Project Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                fontWeight={500}
                color={daysLeft < 0 && project.progress < 100 ? 'error.main' : 'text.primary'}
              >
                {daysLeft < 0 && project.progress < 100
                  ? 'Overdue'
                  : daysLeft === 0
                  ? 'Due today'
                  : `${daysLeft} days left`
                }
              </Typography>
            </Box>
          </Box>
          <ProgressIndicator value={project.progress} size="large" />
        </Box>
      </Paper>
      
      {/* Project tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="project tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="Tasks" 
            icon={<AssignmentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Team" 
            icon={<GroupIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Documents" 
            icon={<FolderIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Comments" 
            icon={<CommentIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      {/* Tab content */}
      <TabPanel value={activeTab} index={0}>
        <TasksTab
          project={project}
          onAddTask={handleAddTask}
        />
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <TeamTab project={project} />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <DocumentsTab
          project={project}
          onAddDocument={handleAddDocument}
        />
      </TabPanel>
      
      <TabPanel value={activeTab} index={3}>
        <CommentsTab
          project={project}
          onAddComment={handleAddComment}
        />
      </TabPanel>
    </Box>
  );
};

export default ProjectDetail;