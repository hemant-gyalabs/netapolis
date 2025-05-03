import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS, getScoreColorHex } from '../../../utils/chartUtils';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const { value, name } = payload[0];
  const factor = payload[0].payload;
  
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {factor.factor}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Value: {value}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Weight: {(factor.weight * 100).toFixed(0)}%
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Contribution: {(factor.weight * value).toFixed(1)} points
      </Typography>
    </Box>
  );
};

const ScoreFactorsChart = ({ data, loading, height = 300, totalScore }) => {
  const theme = useTheme();
  
  // If no data or loading, show skeleton
  if (loading || !data || data.length === 0) {
    return <Skeleton variant="rectangular" height={height} animation="wave" />;
  }
  
  const scoreColor = getScoreColorHex(totalScore || 0);
  
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={data}
        >
          <PolarGrid stroke={theme.palette.divider} />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
            tickCount={5}
            stroke={theme.palette.divider}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke={scoreColor}
            fill={scoreColor}
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ScoreFactorsChart;