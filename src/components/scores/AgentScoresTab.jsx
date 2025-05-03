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
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { scoreService } from '../../services/score.service';
import ScoreCard from './ScoreCard';

// Format currency function
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Score indicator component
const ScoreIndicator = ({ score, size = 'medium' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };
  
  const sizes = {
    small: { width: 36, height: 36, fontSize: '0.875rem' },
    medium: { width: 48, height: 48, fontSize: '1rem' },
    large: { width: 64, height: 64, fontSize: '1.25rem' }
  };
  
  const { width, height, fontSize } = sizes[size] || sizes.medium;
  const color = getScoreColor(score);
  
  return (
    <Tooltip title={`Score: ${score}`} arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          color: `${color}.dark`,
          fontWeight: 'bold',
          fontSize
        }}
      >
        {score}
      </Box>
    </Tooltip>
  );
};

const AgentScoresTab = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);
  
  // Period options
  const periodOptions = [
    { value: '', label: 'All Periods' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'score', label: 'Score', direction: 'desc' },
    { value: 'agentDetails.performance.conversionRate', label: 'Conversion Rate', direction: 'desc' },
    { value: 'agentDetails.performance.revenueGenerated', label: 'Revenue', direction: 'desc' },
    { value: 'agentDetails.performance.customerSatisfaction', label: 'Satisfaction', direction: 'desc' },
    { value: 'createdAt', label: 'Date Created', direction: 'desc' }
  ];
  
  // Fetch agents
  const fetchAgents = async (pageNum = page) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: pageNum,
        limit: viewMode === 'cards' ? 12 : 20,
        sortBy,
        sortOrder
      };
      
      // Add filters if set
      if (periodFilter) {
        params['agentDetails.period'] = periodFilter;
      }
      
      // Add search term if set
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await scoreService.getScoresByType('agent', params);
      setAgents(response.data.scores);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (error) {
      setError('Failed to fetch agent scores: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    fetchAgents(value);
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setPage(1);
    fetchAgents(1);
  };
  
  // Handle search
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchAgents(1);
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
    fetchAgents(1);
  };
  
  // Handle period filter change
  const handlePeriodFilterChange = (event) => {
    setPeriodFilter(event.target.value);
    setPage(1);
    fetchAgents(1);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    const selectedOption = sortOptions.find(option => option.value === event.target.value);
    setSortBy(selectedOption.value);
    setSortOrder(selectedOption.direction);
    setPage(1);
    fetchAgents(1);
  };
  
  // Handle delete agent
  const handleDeleteAgent = async (agent) => {
    try {
      await scoreService.deleteScore(agent._id);
      fetchAgents();
    } catch (error) {
      setError('Failed to delete agent score: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchAgents();
  }, []);
  
  return (
    <Box>
      {/* Header and filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Agent Performance Scores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and evaluate agent performance based on conversion rates, customer satisfaction, and more
            </Typography>
          </Grid>
          
          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {/* Search input */}
              <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Search agents..."
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
              
              {/* Period filter */}
              <FormControl sx={{ minWidth: 130 }} size="small">
                <InputLabel id="period-filter-label">Period</InputLabel>
                <Select
                  labelId="period-filter-label"
                  id="period-filter"
                  value={periodFilter}
                  label="Period"
                  onChange={handlePeriodFilterChange}
                >
                  {periodOptions.map((period) => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
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
              
              {/* View mode toggle */}
              <Button
                variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('cards')}
                sx={{ minWidth: 0, px: 1 }}
              >
                <i className="fas fa-th"></i>
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('table')}
                sx={{ minWidth: 0, px: 1 }}
              >
                <i className="fas fa-list"></i>
              </Button>
              
              {/* Refresh button */}
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchAgents()}
                size="small"
              >
                Refresh
              </Button>
              
              {/* Add new agent button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/scores/agents/new')}
                size="small"
              >
                New Score
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
      
      {/* No results message */}
      {!loading && agents.length === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>
              No Agent Scores Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || periodFilter ? 
               'Try adjusting your search or filters' : 
               'Get started by adding your first agent score'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/scores/agents/new')}
            >
              Add New Agent Score
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Agent cards view */}
      {!loading && agents.length > 0 && viewMode === 'cards' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent._id}>
              <ScoreCard
                score={agent}
                onDelete={handleDeleteAgent}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Agent table view */}
      {!loading && agents.length > 0 && viewMode === 'table' && (
        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="center">Leads Handled</TableCell>
                  <TableCell align="center">Conversion Rate</TableCell>
                  <TableCell align="right">Revenue Generated</TableCell>
                  <TableCell align="center">Satisfaction</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow
                    key={agent._id}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    onClick={() => navigate(`/scores/agents/${agent._id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'info.light', 
                            color: 'info.dark',
                            width: 36,
                            height: 36,
                            mr: 1
                          }}
                        >
                          {agent.agentDetails?.user?.firstName?.[0] || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {agent.agentDetails?.user ? 
                             `${agent.agentDetails.user.firstName} ${agent.agentDetails.user.lastName}` : 
                             'Unknown Agent'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.agentDetails?.user?.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={agent.agentDetails?.period?.charAt(0).toUpperCase() + agent.agentDetails?.period?.slice(1) || 'Unknown'} 
                        size="small"
                        color="info"
                        sx={{ height: 24 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {agent.agentDetails?.performance?.leadsHandled || 0}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" align="center" fontWeight={500} sx={{ mb: 0.5 }}>
                          {agent.agentDetails?.performance?.conversionRate || 0}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={agent.agentDetails?.performance?.conversionRate || 0} 
                          sx={{ height: 4 }}
                          color={
                            (agent.agentDetails?.performance?.conversionRate || 0) >= 70 ? 'success' :
                            (agent.agentDetails?.performance?.conversionRate || 0) >= 40 ? 'primary' :
                            'error'
                          }
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(agent.agentDetails?.performance?.revenueGenerated || 0)}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" align="center" fontWeight={500} sx={{ mb: 0.5 }}>
                          {agent.agentDetails?.performance?.customerSatisfaction || 0}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={agent.agentDetails?.performance?.customerSatisfaction || 0} 
                          sx={{ height: 4 }}
                          color={
                            (agent.agentDetails?.performance?.customerSatisfaction || 0) >= 80 ? 'success' :
                            (agent.agentDetails?.performance?.customerSatisfaction || 0) >= 60 ? 'primary' :
                            'error'
                          }
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ScoreIndicator score={agent.score} size="small" />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/scores/agents/${agent._id}`);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/scores/agents/${agent._id}/edit`);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAgent(agent);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {/* Pagination */}
      {!loading && agents.length > 0 && (
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

export default AgentScoresTab;