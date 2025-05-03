import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Card,
  CardContent,
  Pagination,
  Divider,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { scoreService } from '../../services/score.service';
import ScoreCard from './ScoreCard';

const PropertyScoresTab = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);
  
  // Property type options
  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'mixed', label: 'Mixed Use' }
  ];
  
  // Property status options
  const propertyStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'score', label: 'Score', direction: 'desc' },
    { value: 'createdAt', label: 'Date Created', direction: 'desc' },
    { value: 'propertyDetails.name', label: 'Name', direction: 'asc' },
    { value: 'propertyDetails.price', label: 'Price', direction: 'desc' }
  ];
  
  // Fetch properties
  const fetchProperties = async (pageNum = page) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: pageNum,
        limit: 12,
        sortBy,
        sortOrder
      };
      
      // Add filters if set
      if (typeFilter) {
        params['propertyDetails.type'] = typeFilter;
      }
      
      if (statusFilter) {
        params['propertyDetails.status'] = statusFilter;
      }
      
      // Add search term if set
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await scoreService.getScoresByType('property', params);
      setProperties(response.data.scores);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (error) {
      setError('Failed to fetch property scores: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    fetchProperties(value);
  };
  
  // Handle search
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchProperties(1);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
    fetchProperties(1);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(1);
    fetchProperties(1);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
    fetchProperties(1);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    const selectedOption = sortOptions.find(option => option.value === event.target.value);
    setSortBy(selectedOption.value);
    setSortOrder(selectedOption.direction);
    setPage(1);
    fetchProperties(1);
  };
  
  // Handle delete property
  const handleDeleteProperty = async (property) => {
    try {
      await scoreService.deleteScore(property._id);
      fetchProperties();
    } catch (error) {
      setError('Failed to delete property: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchProperties();
  }, []);
  
  return (
    <Box>
      {/* Header and filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Property Scores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Evaluate and track property scores based on location, features, and market potential
            </Typography>
          </Grid>
          
          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {/* Search input */}
              <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: '100%', sm: 200 } }}
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
                />
              </form>
              
              {/* Type filter */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  value={typeFilter}
                  label="Type"
                  onChange={handleTypeFilterChange}
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Status filter */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  {propertyStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Sort by */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Refresh button */}
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchProperties()}
                size="small"
              >
                Refresh
              </Button>
              
              {/* Add new property button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/scores/properties/new')}
                size="small"
              >
                New Property
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Property cards */}
      {!loading && properties.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>
              No Property Scores Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || typeFilter || statusFilter ? 
               'Try adjusting your search or filters' : 
               'Get started by adding your first property score'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/scores/properties/new')}
            >
              Add New Property Score
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <ScoreCard
                score={property}
                onDelete={handleDeleteProperty}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default PropertyScoresTab;