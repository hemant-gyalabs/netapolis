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

const LeadScoresTab = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);
  
  // Lead status options
  const leadStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed', label: 'Closed' },
    { value: 'lost', label: 'Lost' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'score', label: 'Score', direction: 'desc' },
    { value: 'createdAt', label: 'Date Created', direction: 'desc' },
    { value: 'leadDetails.name', label: 'Name', direction: 'asc' }
  ];
  
  // Fetch leads
  const fetchLeads = async (pageNum = page) => {
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
      if (statusFilter) {
        params['leadDetails.status'] = statusFilter;
      }
      
      // Add search term if set
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await scoreService.getScoresByType('lead', params);
      setLeads(response.data.scores);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (error) {
      setError('Failed to fetch lead scores: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    fetchLeads(value);
  };
  
  // Handle search
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchLeads(1);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
    fetchLeads(1);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
    fetchLeads(1);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    const selectedOption = sortOptions.find(option => option.value === event.target.value);
    setSortBy(selectedOption.value);
    setSortOrder(selectedOption.direction);
    setPage(1);
    fetchLeads(1);
  };
  
  // Handle delete lead
  const handleDeleteLead = async (lead) => {
    try {
      await scoreService.deleteScore(lead._id);
      fetchLeads();
    } catch (error) {
      setError('Failed to delete lead: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchLeads();
  }, []);
  
  return (
    <Box>
      {/* Header and filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Lead Scores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and evaluate potential client leads based on multiple factors
            </Typography>
          </Grid>
          
          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {/* Search input */}
              <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Search leads..."
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
              
              {/* Status filter */}
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  {leadStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Sort by */}
              <FormControl sx={{ minWidth: 150 }} size="small">
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
                onClick={() => fetchLeads()}
                size="small"
              >
                Refresh
              </Button>
              
              {/* Add new lead button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/scores/leads/new')}
                size="small"
              >
                New Lead
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
      
      {/* Lead cards */}
      {!loading && leads.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>
              No Lead Scores Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || statusFilter ? 
               'Try adjusting your search or filters' : 
               'Get started by adding your first lead score'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/scores/leads/new')}
            >
              Add New Lead Score
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {leads.map((lead) => (
            <Grid item xs={12} sm={6} md={4} key={lead._id}>
              <ScoreCard
                score={lead}
                onDelete={handleDeleteLead}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Pagination */}
      {!loading && leads.length > 0 && (
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

export default LeadScoresTab;