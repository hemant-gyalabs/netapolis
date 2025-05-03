import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
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
        {label}
      </Typography>
      
      {payload
        .filter(entry => entry.value !== null)
        .sort((a, b) => b.value - a.value)
        .map((entry, index) => (
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
              {entry.name}: {entry.value !== null ? entry.value.toFixed(1) : 'N/A'}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

const ScoreTrendChart = ({ data, loading, height = 300 }) => {
  const theme = useTheme();
  
  // If no data or loading, show skeleton
  if (loading || !data || data.length === 0) {
    return <Skeleton variant="rectangular" height={height} animation="wave" />;
  }
  
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: theme.palette.divider }}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            domain={[0, 100]}
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
          
          {/* Reference lines for score thresholds */}
          <ReferenceLine y={80} stroke={CHART_COLORS.status.success} strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={60} stroke={CHART_COLORS.status.primary} strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={40} stroke={CHART_COLORS.status.warning} strokeDasharray="3 3" strokeWidth={1} />
          
          <Line
            type="monotone"
            dataKey="lead"
            name="Lead Scores"
            stroke={CHART_COLORS.primary[3]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 1, stroke: CHART_COLORS.primary[3], fill: 'white' }}
            activeDot={{ r: 6, stroke: CHART_COLORS.primary[3], strokeWidth: 1, fill: CHART_COLORS.primary[3] }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="property"
            name="Property Scores"
            stroke={CHART_COLORS.primary[0]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 1, stroke: CHART_COLORS.primary[0], fill: 'white' }}
            activeDot={{ r: 6, stroke: CHART_COLORS.primary[0], strokeWidth: 1, fill: CHART_COLORS.primary[0] }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="agent"
            name="Agent Scores"
            stroke={CHART_COLORS.primary[1]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 1, stroke: CHART_COLORS.primary[1], fill: 'white' }}
            activeDot={{ r: 6, stroke: CHART_COLORS.primary[1], strokeWidth: 1, fill: CHART_COLORS.primary[1] }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ScoreTrendChart;