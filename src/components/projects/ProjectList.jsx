import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  DateRange as DateRangeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { projectService } from '../../services/project.service';

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

// Project type chip component
const ProjectTypeChip = ({ type }) => {
  const typeConfig = {
    residential: { label: 'Residential', color: 'primary' },
    commercial: { label: 'Commercial', color: 'secondary' },
    mixed: { label: 'Mixed Use', color: 'info' },
    land: { label: 'Land', color: 'success' }
  };
  
  const config = typeConfig[type] || { label: 'Unknown', color: 'default' };
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      variant="outlined"
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

// Progress indicator component
const ProgressIndicator = ({ value, size = 'medium' }) => {
  const getColor = (val) => {
    if (val >= 75) return 'success';
    if (val >= 40) return 'primary';
    if (val >= 20) return 'warning';
    return 'error';
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          color={getColor(value)}
          sx={{
            height: size === 'small' ? 4 : 8,
            borderRadius: size === 'small' ? 2 : 4,
            backgroundColor: 'grey.200'
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

// Project card component
const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const handleViewClick = () => {
    if (onView) onView(project);
    else navigate(`/projects/${project._id}`);
    handleMenuClose();
  };
  
  const handleEditClick = () => {
    if (onEdit) onEdit(project);
    else navigate(`/projects/${project._id}/edit`);
    handleMenuClose();
  };
  
  const handleDeleteClick = () => {
    if (onDelete) onDelete(project);
    handleMenuClose();
  };
  
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        },
        cursor: 'pointer'
      }}
      onClick={handleViewClick}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <ProjectTypeChip type={project.propertyType} />
            <ProjectStatusChip status={project.status} sx={{ ml: 1 }} />
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleViewClick}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={handleEditClick}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit Project
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete Project
            </MenuItem>
          </Menu>
        </Box>
        
        {/* Project name and location */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: 48
          }}
        >
          {project.name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {project.location.area}, {project.location.city}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Project details */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" noWrap>
              PM: {project.manager.firstName} {project.manager.lastName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{ mr: 1 }}
            >
              Budget:
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
            >
              {formatCurrency(project.budget.total)}
            </Typography>
          </Box>
        </Box>
        
        {/* Progress indicator */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              Progress
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
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
          <ProgressIndicator value={project.progress} />
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="View team members">
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem' }}
              >
                {project.team.length}
              </Avatar>
            </Tooltip>
            
            <Tooltip title="View tasks">
              <Chip
                label={`${project.tasks.length} Tasks`}
                size="small"
                sx={{
                  ml: 1,
                  height: 24,
                  '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                }}
              />
            </Tooltip>
          </Box>
          
          <Button
            size="small"
            endIcon={<VisibilityIcon fontSize="small" />}
            onClick={handleViewClick}
          >
            View
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

// Main project list component
const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
  
  // Status options for filtering
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'planning', label: 'Planning' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'onHold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' }
  ];
  
  // Type options for filtering
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'mixed', label: 'Mixed Use' },
    { value: 'land', label: 'Land' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'createdAt', label: 'Creation Date', defaultOrder: 'desc' },
    { value: 'name', label: 'Project Name', defaultOrder: 'asc' },
    { value: 'endDate', label: 'End Date', defaultOrder: 'asc' },
    { value: 'progress', label: 'Progress', defaultOrder: 'desc' }
  ];
  
  // Load projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {
        page,
        limit: 12,
        sortBy,
        sortOrder
      };
      
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.propertyType = typeFilter;
      
      const response = await projectService.getAllProjects(params);
      
      setProjects(response.data.projects);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Search projects
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadProjects();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.searchProjects(searchTerm);
      setProjects(response.data.projects);
      setTotalPages(1); // Search results don't have pagination for simplicity
    } catch (err) {
      setError('Failed to search projects. Please try again later.');
      console.error('Error searching projects:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    loadProjects();
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setPage(1);
  };
  
  // Handle sort menu open
  const handleSortMenuOpen = (e) => {
    setSortMenuAnchorEl(e.currentTarget);
  };
  
  // Handle sort menu close
  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };
  
  // Handle sort option select
  const handleSortSelect = (option) => {
    setSortBy(option.value);
    setSortOrder(option.defaultOrder);
    setPage(1);
    handleSortMenuClose();
  };
  
  // Toggle sort order
  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // Handle create new project
  const handleCreateProject = () => {
    navigate('/projects/new');
  };
  
  // Handle delete project
  const handleDeleteProject = async (project) => {
    // In a real app, we would show a confirmation dialog
    if (!window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      return;
    }
    
    try {
      await projectService.deleteProject(project._id);
      loadProjects();
    } catch (err) {
      setError('Failed to delete project. Please try again later.');
      console.error('Error deleting project:', err);
    }
  };
  
  // Load projects on mount and when filters/sort/page change
  useEffect(() => {
    loadProjects();
  }, [page, statusFilter, typeFilter, sortBy, sortOrder]);
  
  // Get current sort option
  const currentSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Projects
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create Project
        </Button>
      </Box>
      
      {/* Filters and search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search form */}
          <Grid item xs={12} sm={6} md={4}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </form>
          </Grid>
          
          {/* Status filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Type filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Type"
                onChange={handleTypeFilterChange}
              >
                {typeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Sort options */}
          <Grid item xs={6} sm={6} md={2}>
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              endIcon={sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              onClick={handleSortMenuOpen}
              fullWidth
              size="small"
            >
              {currentSortOption.label}
            </Button>
            <Menu
              anchorEl={sortMenuAnchorEl}
              open={Boolean(sortMenuAnchorEl)}
              onClose={handleSortMenuClose}
            >
              {sortOptions.map(option => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSortSelect(option)}
                  selected={sortBy === option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={handleToggleSortOrder}>
                {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              </MenuItem>
            </Menu>
          </Grid>
          
          {/* Refresh button */}
          <Grid item xs={6} sm={6} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadProjects}
              fullWidth
              size="small"
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Project list */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={290} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || statusFilter || typeFilter
              ? 'Try adjusting your search filters'
              : 'Start by creating your first project'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{ mt: 2 }}
          >
            Create Project
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {projects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <ProjectCard
                  project={project}
                  onDelete={handleDeleteProject}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProjectList;