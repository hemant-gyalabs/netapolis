import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../../utils/chartUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
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
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Score Range: {label}
      </Typography>
      
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: entry.color,
              mr: 1
            }}
          />
          <Typography variant="body2">
            {entry.name}: {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const ScoreDistributionChart = ({ data, loading, height = 300 }) => {
  const theme = useTheme();
  
  // If no data or loading, show skeleton
  if (loading || !data || data.length === 0) {
    return <Skeleton variant="rectangular" height={height} animation="wave" />;
  }
  
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
          />
          <XAxis
            dataKey="range"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: theme.palette.divider }}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: theme.palette.divider }}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => (
              <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="lead"
            name="Lead Scores"
            fill={CHART_COLORS.primary[3]}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="property"
            name="Property Scores"
            fill={CHART_COLORS.primary[0]}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="agent"
            name="Agent Scores"
            fill={CHART_COLORS.primary[1]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ScoreDistributionChart;