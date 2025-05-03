/**
 * Project Helper Components
 * 
 * This file contains reusable UI components and helpers for the project management system
 */

import { Box, Chip, Typography, LinearProgress } from '@mui/material';

// Project status chip component
export const ProjectStatusChip = ({ status }) => {
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
export const ProjectTypeChip = ({ type }) => {
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
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency for display (Indian currency format)
export const formatCurrency = (amount) => {
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
export const ProgressIndicator = ({ value, size = 'medium' }) => {
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