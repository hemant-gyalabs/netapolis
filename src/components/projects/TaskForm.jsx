import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { projectService } from '../../services/project.service';

// Mock users data for assignees
const MOCK_USERS = [
  { _id: 'user_1', firstName: 'Raj', lastName: 'Sharma', email: 'raj.sharma@example.com' },
  { _id: 'user_2', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com' },
  { _id: 'user_3', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@example.com' },
  { _id: 'user_4', firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@example.com' },
  { _id: 'user_5', firstName: 'Rahul', lastName: 'Kumar', email: 'rahul.kumar@example.com' },
  { _id: 'user_6', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@example.com' }
];

// Format date as ISO string
const formatDateForAPI = (date) => {
  if (!date) return '';
  return date.toISOString();
};

// Task form component
const TaskForm = ({ projectId, task, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    startDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
    assignedTo: null
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Load task data if editing
  useEffect(() => {
    if (task) {
      // Convert dates from strings to Date objects
      const taskData = {
        ...task,
        startDate: task.startDate ? new Date(task.startDate) : new Date(),
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(new Date().setDate(new Date().getDate() + 7))
      };
      
      setFormData(taskData);
    }
  }, [task]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error for the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle assignee selection
  const handleAssigneeChange = (event, newValue) => {
    setFormData({
      ...formData,
      assignedTo: newValue
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name) {
      newErrors.name = 'Task name is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (formData.startDate && formData.dueDate < formData.startDate) {
      newErrors.dueDate = 'Due date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for API
    const taskData = {
      ...formData,
      startDate: formatDateForAPI(formData.startDate),
      dueDate: formatDateForAPI(formData.dueDate)
    };
    
    onSubmit(taskData);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              {task ? 'Edit Task' : 'Create New Task'}
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
            >
              Back
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {/* Task name */}
            <Grid item xs={12}>
              <TextField
                label="Task Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Task description */}
            <Grid item xs={12}>
              <TextField
                label="Task Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Provide a detailed description of the task"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Task status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Task Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  label="Task Status"
                  onChange={handleChange}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Task priority */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlagIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Task start date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{ 
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      )
                    }
                  }
                }}
              />
            </Grid>
            
            {/* Task due date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date) => handleDateChange('dueDate', date)}
                slotProps={{ 
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      )
                    }
                  }
                }}
              />
            </Grid>
            
            {/* Task assignee */}
            <Grid item xs={12}>
              <Autocomplete
                options={MOCK_USERS}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={formData.assignedTo}
                onChange={handleAssigneeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned To"
                    placeholder="Select a team member"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div>
                      <Typography variant="body1">
                        {option.firstName} {option.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.email}
                      </Typography>
                    </div>
                  </li>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Form actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isLoading}
          >
            {task ? 'Update' : 'Create'} Task
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

// Create task page component
export const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState(null);
  
  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoadingProject(true);
        const response = await projectService.getProjectById(projectId);
        setProject(response.data.project);
      } catch (err) {
        setError('Failed to load project data. Please try again later.');
        console.error('Error loading project:', err);
      } finally {
        setLoadingProject(false);
      }
    };
    
    loadProjectData();
  }, [projectId]);
  
  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.addTask(projectId, taskData);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to create task. Please try again later.');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading state
  if (loadingProject) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
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
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            navigate(`/projects/${projectId}`); 
          }}
        >
          {project?.name || 'Project Details'}
        </Link>
        <Typography color="text.primary">New Task</Typography>
      </Breadcrumbs>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TaskForm
        projectId={projectId}
        onSubmit={handleCreateTask}
        isLoading={loading}
      />
    </Box>
  );
};

// Edit task page component
export const EditTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  
  // Load project and task data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const response = await projectService.getProjectById(projectId);
        const project = response.data.project;
        setProject(project);
        
        // Find the task in the project
        const task = project.tasks.find(t => t._id === taskId);
        if (task) {
          setTask(task);
        } else {
          setError('Task not found in this project.');
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [projectId, taskId]);
  
  const handleUpdateTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.updateTask(projectId, taskId, taskData);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to update task. Please try again later.');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading state
  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state if task not found
  if (!task) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Task not found. It may have been deleted or moved.
      </Alert>
    );
  }
  
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
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            navigate(`/projects/${projectId}`); 
          }}
        >
          {project?.name || 'Project Details'}
        </Link>
        <Typography color="text.primary">Edit Task</Typography>
      </Breadcrumbs>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TaskForm
        projectId={projectId}
        task={task}
        onSubmit={handleUpdateTask}
        isLoading={loading}
      />
    </Box>
  );
};

export default TaskForm;