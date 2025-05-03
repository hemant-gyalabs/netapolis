import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../../utils/chartUtils';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Only show label if percent is above threshold
  if (percent < 0.05) return null;
  
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const { name, value, payload: item } = payload[0];
  
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
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Count: {value}
      </Typography>
      {item.averageScore !== undefined && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Avg. Score: {item.averageScore.toFixed(1)}
        </Typography>
      )}
    </Box>
  );
};

const StatusDistributionChart = ({ data, loading, height = 300, nameKey = 'status', valueKey = 'value', scoreKey = 'averageScore' }) => {
  const theme = useTheme();
  
  // If no data or loading, show skeleton
  if (loading || !data || data.length === 0) {
    return <Skeleton variant="rectangular" height={height} animation="wave" />;
  }
  
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={30}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StatusDistributionChart;