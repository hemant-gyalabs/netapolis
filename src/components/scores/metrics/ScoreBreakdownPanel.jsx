import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  useTheme,
  IconButton,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getScoreColor, getProgressGradient } from '../../../utils/chartUtils';

// Score factor item component
const ScoreFactorItem = ({ factor, weight, value }) => {
  const theme = useTheme();
  const contribution = weight * value;
  const color = getScoreColor(value);
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {factor}
          </Typography>
          <Chip
            label={`${(weight * 100).toFixed(0)}%`}
            size="small"
            sx={{
              ml: 1,
              height: 18,
              fontSize: '0.7rem',
              bgcolor: 'action.hover'
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: `${color}.main`
          }}
        >
          {value.toFixed(1)}
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: 'action.hover',
          mb: 0.5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            background: getProgressGradient(value)
          }
        }}
      />
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Contribution:
        </Typography>
        <Tooltip title={`${factor} contributes ${contribution.toFixed(1)} points to the total score`} arrow>
          <Chip
            label={`${contribution.toFixed(1)} pts`}
            size="small"
            color={color}
            sx={{
              ml: 1,
              height: 18,
              fontSize: '0.7rem'
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

// Main component
const ScoreBreakdownPanel = ({ score, scoreFactors, title = "Score Breakdown" }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  
  // If no score or factors, don't render
  if (!score || !scoreFactors || scoreFactors.length === 0) {
    return null;
  }
  
  // Sort factors by contribution (weight * value) in descending order
  const sortedFactors = [...scoreFactors].sort((a, b) => (b.weight * b.value) - (a.weight * a.value));
  
  // Get score color
  const scoreColor = getScoreColor(score);
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              borderRadius: '50%',
              bgcolor: `${scoreColor}.light`,
              color: `${scoreColor}.dark`,
              fontWeight: 'bold',
              fontSize: '1.25rem',
              mr: 2
            }}
          >
            {score.toFixed(1)}
          </Box>
          
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on {scoreFactors.length} factors
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Score is calculated as a weighted average of all factors" arrow>
            <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => e.stopPropagation()}>
              <InfoIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
          
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>
      
      <Divider />
      
      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {sortedFactors.map((factor, index) => (
            <ScoreFactorItem
              key={index}
              factor={factor.factor}
              weight={factor.weight}
              value={factor.value}
            />
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ScoreBreakdownPanel;