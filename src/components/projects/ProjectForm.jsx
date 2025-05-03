import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { projectService } from '../../services/project.service';

// Mock users data for team selection
const MOCK_USERS = [
  { _id: 'user_1', firstName: 'Raj', lastName: 'Sharma', email: 'raj.sharma@example.com' },
  { _id: 'user_2', firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com' },
  { _id: 'user_3', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@example.com' },
  { _id: 'user_4', firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@example.com' },
  { _id: 'user_5', firstName: 'Rahul', lastName: 'Kumar', email: 'rahul.kumar@example.com' },
  { _id: 'user_6', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@example.com' }
];

// Mock locations data
const MOCK_LOCATIONS = [
  'Banjara Hills',
  'Jubilee Hills',
  'Gachibowli',
  'Madhapur',
  'Kukatpally',
  'HITEC City',
  'Kondapur',
  'Miyapur',
  'Manikonda',
  'Narsingi'
];

// Format date as ISO string
const formatDateForAPI = (date) => {
  if (!date) return '';
  return date.toISOString();
};

// Project form component
const ProjectForm = ({ project, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      area: '',
      city: 'Hyderabad'
    },
    propertyType: 'residential',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)), // Default to 6 months from now
    status: 'planning',
    budget: {
      total: '',
      currency: 'INR'
    },
    manager: null,
    team: []
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Load project data if editing
  useEffect(() => {
    if (project) {
      // Convert dates from strings to Date objects
      const projectData = {
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate)
      };
      
      setFormData(projectData);
    }
  }, [project]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
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
  
  // Handle manager selection
  const handleManagerChange = (event, newValue) => {
    setFormData({
      ...formData,
      manager: newValue
    });
    
    // Clear error for the field
    if (errors.manager) {
      setErrors({
        ...errors,
        manager: null
      });
    }
  };
  
  // Handle team selection
  const handleTeamChange = (event, newValue) => {
    setFormData({
      ...formData,
      team: newValue
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.location.area) {
      newErrors['location.area'] = 'Project area is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.budget.total) {
      newErrors['budget.total'] = 'Budget is required';
    } else if (isNaN(formData.budget.total) || Number(formData.budget.total) <= 0) {
      newErrors['budget.total'] = 'Budget must be a positive number';
    }
    
    if (!formData.manager) {
      newErrors.manager = 'Project manager is required';
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
    const projectData = {
      ...formData,
      startDate: formatDateForAPI(formData.startDate),
      endDate: formatDateForAPI(formData.endDate),
      budget: {
        ...formData.budget,
        total: Number(formData.budget.total)
      }
    };
    
    onSubmit(projectData);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
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
              {project ? 'Edit Project' : 'Create New Project'}
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
            {/* Project name */}
            <Grid item xs={12}>
              <TextField
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            
            {/* Project description */}
            <Grid item xs={12}>
              <TextField
                label="Project Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Provide a brief description of the project"
              />
            </Grid>
            
            {/* Project location */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={MOCK_LOCATIONS}
                freeSolo
                value={formData.location.area}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      area: newValue || ''
                    }
                  });
                  // Clear error
                  if (errors['location.area']) {
                    setErrors({
                      ...errors,
                      ['location.area']: null
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Area"
                    name="location.area"
                    required
                    error={!!errors['location.area']}
                    helperText={errors['location.area']}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Project city */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Property type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="property-type-label">Property Type</InputLabel>
                <Select
                  labelId="property-type-label"
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  label="Property Type"
                  onChange={handleChange}
                >
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="mixed">Mixed Use</MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Project status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Project Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  label="Project Status"
                  onChange={handleChange}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="onHold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Project start date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{ 
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
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
            
            {/* Project end date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleDateChange('endDate', date)}
                slotProps={{ 
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
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
            
            {/* Project budget */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Budget Amount"
                name="budget.total"
                value={formData.budget.total}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.budget.currency}
                    </InputAdornment>
                  )
                }}
                error={!!errors['budget.total']}
                helperText={errors['budget.total']}
              />
            </Grid>
            
            {/* Project manager */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={MOCK_USERS}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={formData.manager}
                onChange={handleManagerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Manager"
                    required
                    error={!!errors.manager}
                    helperText={errors.manager}
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
            
            {/* Project team */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={MOCK_USERS}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={formData.team}
                onChange={handleTeamChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team Members"
                    placeholder="Add team members"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <GroupIcon color="action" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.firstName} ${option.lastName}`}
                      {...getTagProps({ index })}
                    />
                  ))
                }
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
            {project ? 'Update' : 'Create'} Project
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

// Create project page component
export const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCreateProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.createProject(projectData);
      navigate(`/projects/${response.data.project._id}`);
    } catch (err) {
      setError('Failed to create project. Please try again later.');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <ProjectForm
        onSubmit={handleCreateProject}
        isLoading={loading}
      />
    </Box>
  );
};

// Edit project page component
export const EditProject = ({ project }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleUpdateProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.updateProject(project._id, projectData);
      navigate(`/projects/${response.data.project._id}`);
    } catch (err) {
      setError('Failed to update project. Please try again later.');
      console.error('Error updating project:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <ProjectForm
        project={project}
        onSubmit={handleUpdateProject}
        isLoading={loading}
      />
    </Box>
  );
};

export default ProjectForm;