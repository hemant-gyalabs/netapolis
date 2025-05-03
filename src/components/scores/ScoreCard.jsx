import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency function
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get score color based on value
const getScoreColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'primary';
  if (score >= 40) return 'warning';
  return 'error';
};

// Get status chip color
const getStatusColor = (status, type) => {
  // Lead status colors
  if (type === 'lead') {
    switch (status) {
      case 'new': return 'info';
      case 'contacted': return 'primary';
      case 'qualified': return 'success';
      case 'negotiation': return 'warning';
      case 'closed': return 'success';
      case 'lost': return 'error';
      default: return 'default';
    }
  }
  
  // Property status colors
  if (type === 'property') {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'primary';
      default: return 'default';
    }
  }
  
  // Default
  return 'default';
};

// Format status text
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Score indicator component
const ScoreIndicator = ({ score, size = 'medium' }) => {
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

// Main component
const ScoreCard = ({ score, onDelete, onEdit, showActions = true }) => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  // Extract score details based on type
  const getDetails = () => {
    if (!score) return null;
    
    // Lead details
    if (score.type === 'lead') {
      return {
        name: score.leadDetails?.name || 'Unknown Lead',
        subtitle: score.leadDetails?.email || '',
        description: score.leadDetails?.interestedIn?.join(', ') || 'No interests specified',
        status: score.leadDetails?.status,
        avatar: {
          text: (score.leadDetails?.name?.[0] || 'L'),
          color: 'primary'
        },
        assigned: score.leadDetails?.assignedTo ? 
                 `${score.leadDetails.assignedTo.firstName} ${score.leadDetails.assignedTo.lastName}` : 
                 'Unassigned',
        detailItems: [
          { label: 'Budget', value: score.leadDetails?.budget ? 
                              `${formatCurrency(score.leadDetails.budget.min)} - ${formatCurrency(score.leadDetails.budget.max)}` : 
                              'Not specified' },
          { label: 'Source', value: score.leadDetails?.source ? 
                              score.leadDetails.source.charAt(0).toUpperCase() + score.leadDetails.source.slice(1) : 
                              'Unknown' },
          { label: 'Phone', value: score.leadDetails?.phone || 'Not provided' }
        ]
      };
    }
    
    // Property details
    if (score.type === 'property') {
      return {
        name: score.propertyDetails?.name || 'Unknown Property',
        subtitle: `${score.propertyDetails?.location?.area || ''}, ${score.propertyDetails?.location?.city || ''}`,
        description: `${score.propertyDetails?.type?.charAt(0).toUpperCase() + score.propertyDetails?.type?.slice(1) || 'Unknown'} property`,
        status: score.propertyDetails?.status,
        avatar: {
          text: (score.propertyDetails?.name?.[0] || 'P'),
          color: 'secondary'
        },
        assigned: null,
        detailItems: [
          { label: 'Price', value: formatCurrency(score.propertyDetails?.price) },
          { label: 'Size', value: score.propertyDetails?.size ? `${score.propertyDetails.size} sq ft` : 'Not specified' },
          { label: 'Amenities', value: score.propertyDetails?.amenities?.length ? 
                                 score.propertyDetails.amenities.join(', ') : 
                                 'None listed' }
        ]
      };
    }
    
    // Agent details
    if (score.type === 'agent') {
      return {
        name: score.agentDetails?.user ? 
              `${score.agentDetails.user.firstName} ${score.agentDetails.user.lastName}` : 
              'Unknown Agent',
        subtitle: score.agentDetails?.user?.email || '',
        description: `Performance period: ${score.agentDetails?.period || 'monthly'}`,
        status: null,
        avatar: {
          text: (score.agentDetails?.user?.firstName?.[0] || 'A'),
          color: 'info'
        },
        assigned: null,
        detailItems: [
          { label: 'Leads Handled', value: score.agentDetails?.performance?.leadsHandled || 0 },
          { label: 'Conversion Rate', value: `${score.agentDetails?.performance?.conversionRate || 0}%` },
          { label: 'Revenue', value: formatCurrency(score.agentDetails?.performance?.revenueGenerated) }
        ],
        performance: {
          conversionRate: score.agentDetails?.performance?.conversionRate || 0,
          customerSatisfaction: score.agentDetails?.performance?.customerSatisfaction || 0
        }
      };
    }
    
    return null;
  };
  
  const details = getDetails();
  
  if (!score || !details) return null;
  
  // Handle view details
  const handleViewDetails = () => {
    let path = '';
    switch (score.type) {
      case 'lead': path = `/scores/leads/${score._id}`; break;
      case 'property': path = `/scores/properties/${score._id}`; break;
      case 'agent': path = `/scores/agents/${score._id}`; break;
      default: return;
    }
    navigate(path);
    handleMenuClose();
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Handle edit
  const handleEdit = (event) => {
    event.stopPropagation();
    if (onEdit) onEdit(score);
    handleMenuClose();
  };
  
  // Handle delete
  const handleDelete = (event) => {
    event.stopPropagation();
    if (onDelete) onDelete(score);
    handleMenuClose();
  };
  
  // Handle card click
  const handleCardClick = () => {
    handleViewDetails();
  };
  
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.main'
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: `${details.avatar.color}.light`, 
                color: `${details.avatar.color}.dark`,
                mr: 2
              }}
            >
              {details.avatar.text}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {details.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {details.subtitle}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {details.status && (
              <Chip
                label={formatStatus(details.status)}
                size="small"
                color={getStatusColor(details.status, score.type)}
                sx={{ mr: 1 }}
              />
            )}
            
            <ScoreIndicator score={score.score} />
            
            {showActions && (
              <>
                <IconButton
                  aria-label="score options"
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem onClick={handleViewDetails}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                  </MenuItem>
                  {onEdit && (
                    <MenuItem onClick={handleEdit}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Edit
                    </MenuItem>
                  )}
                  {onDelete && (
                    <MenuItem onClick={handleDelete}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Box>
        
        <Divider />
        
        {/* Content */}
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {details.description}
          </Typography>
          
          {details.assigned && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Assigned to:</strong> {details.assigned}
            </Typography>
          )}
          
          {details.detailItems.map((item, index) => (
            <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>{item.label}:</strong> {item.value}
            </Typography>
          ))}
          
          {/* Performance indicators for agents */}
          {score.type === 'agent' && details.performance && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    {details.performance.conversionRate}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={details.performance.conversionRate} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: 'grey.200'
                  }}
                  color={
                    details.performance.conversionRate >= 70 ? 'success' :
                    details.performance.conversionRate >= 40 ? 'primary' :
                    'error'
                  }
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="caption" fontWeight={500}>
                    {details.performance.customerSatisfaction}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={details.performance.customerSatisfaction} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: 'grey.200'
                  }}
                  color={
                    details.performance.customerSatisfaction >= 70 ? 'success' :
                    details.performance.customerSatisfaction >= 40 ? 'primary' :
                    'error'
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(score.createdAt)}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {score.scoreFactors && score.scoreFactors.length > 0 && (
              <Tooltip title="Score based on multiple factors" arrow>
                <Chip
                  label={`${score.scoreFactors.length} Factors`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 24 }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;