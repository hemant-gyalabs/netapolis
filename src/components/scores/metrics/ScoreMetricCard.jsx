import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

import { formatNumber, formatPercentage, getScoreColor, getProgressGradient } from '../../../utils/chartUtils';

const ScoreMetricCard = ({
  title,
  value,
  previousValue,
  unit = '',
  icon,
  loading = false,
  color,
  progressValue,
  subtitle,
  helperText,
  onClick,
  percentageChange,
  isScoreValue = false,
  hideProgress = false,
  renderTrend = true
}) => {
  const theme = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  
  // Format the value based on its type and unit
  const formatValue = (val) => {
    if (val === null || val === undefined) return 'N/A';
    
    if (unit === '%') return formatPercentage(val);
    if (unit === '#') return formatNumber(val);
    if (isScoreValue) return val.toFixed(1);
    
    return val.toString();
  };
  
  // Calculate percentage change if not provided
  const change = percentageChange !== undefined
    ? percentageChange
    : previousValue !== null && previousValue !== undefined && previousValue !== 0
      ? ((value - previousValue) / previousValue) * 100
      : null;
  
  // Determine trend
  const getTrendIcon = () => {
    if (!renderTrend || change === null) return null;
    
    if (change > 2) {
      return (
        <TrendingUpIcon
          fontSize="small"
          sx={{
            color: isScoreValue ? getScoreColor(value) : 'success.main',
            ml: 1
          }}
        />
      );
    } else if (change < -2) {
      return (
        <TrendingDownIcon
          fontSize="small"
          sx={{
            color: isScoreValue ? getScoreColor(value) : 'error.main',
            ml: 1
          }}
        />
      );
    } else {
      return (
        <TrendingFlatIcon
          fontSize="small"
          sx={{
            color: 'text.secondary',
            ml: 1
          }}
        />
      );
    }
  };
  
  // Get progress background
  const getProgressBackground = () => {
    if (!isScoreValue) return theme.palette.primary.main;
    return getProgressGradient(value);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.main'
        } : {}
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 2 }}>
        {/* Header with title and info icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: color ? `${color}.light` : 'primary.light',
                  color: color ? `${color}.main` : 'primary.main',
                  mr: 1
                }}
              >
                {icon}
              </Box>
            )}
            <Typography
              variant="subtitle1"
              color={color ? `${color}.main` : 'primary.main'}
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
          </Box>
          
          {helperText && (
            <Tooltip
              title={helperText}
              arrow
              open={showHelp}
              onOpen={() => setShowHelp(true)}
              onClose={() => setShowHelp(false)}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelp(!showHelp);
                }}
              >
                <InfoIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {/* Main value */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
          {loading ? (
            <Skeleton width={120} height={44} />
          ) : (
            <>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: isScoreValue ? getScoreColor(value) : 'text.primary'
                }}
              >
                {formatValue(value)}
              </Typography>
              
              {unit && unit !== '#' && unit !== '%' && (
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ ml: 0.5, mb: 0.5, color: 'text.secondary' }}
                >
                  {unit}
                </Typography>
              )}
              
              {getTrendIcon()}
            </>
          )}
        </Box>
        
        {/* Subtitle or trend info */}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {/* Percentage change chip */}
        {change !== null && renderTrend && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label={`${change > 0 ? '+' : ''}${change.toFixed(1)}% from previous`}
              size="small"
              color={change > 2 ? 'success' : change < -2 ? 'error' : 'default'}
              variant="outlined"
              sx={{ height: 24 }}
            />
          </Box>
        )}
      </Box>
      
      {/* Progress bar */}
      {!hideProgress && progressValue !== undefined && (
        <>
          <Divider />
          <Box sx={{ p: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progressValue}%
              </Typography>
            </Box>
            
            {loading ? (
              <Skeleton variant="rectangular" height={8} width="100%" />
            ) : (
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: getProgressBackground()
                  }
                }}
              />
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ScoreMetricCard;