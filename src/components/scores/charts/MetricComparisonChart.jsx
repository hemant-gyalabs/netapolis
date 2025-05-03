import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
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
            {entry.name}: {entry.value !== null ? entry.value : 'N/A'}
            {entry.unit ? ` ${entry.unit}` : ''}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MetricComparisonChart = ({
  data,
  loading,
  height = 300,
  valueKey = 'value',
  nameKey = 'type',
  scoreKey = 'score',
  showScore = true,
  valueUnit = '',
  scoreUnit = '',
  referenceLine = null,
  referenceLabel = ''
}) => {
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
            dataKey={nameKey}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: theme.palette.divider }}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke={CHART_COLORS.primary[0]}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickLine={{ stroke: theme.palette.divider }}
            axisLine={{ stroke: CHART_COLORS.primary[0] }}
          >
            {valueUnit && (
              <Label
                value={valueUnit}
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fill: theme.palette.text.secondary, fontSize: 12 }}
                offset={-5}
              />
            )}
          </YAxis>
          
          {showScore && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke={CHART_COLORS.primary[3]}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickLine={{ stroke: theme.palette.divider }}
              axisLine={{ stroke: CHART_COLORS.primary[3] }}
            >
              {scoreUnit && (
                <Label
                  value={scoreUnit}
                  position="insideRight"
                  angle={90}
                  style={{ textAnchor: 'middle', fill: theme.palette.text.secondary, fontSize: 12 }}
                  offset={-5}
                />
              )}
            </YAxis>
          )}
          
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: theme.palette.action.hover }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => (
              <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                {value}
              </span>
            )}
          />
          
          {referenceLine !== null && (
            <ReferenceLine
              y={referenceLine}
              yAxisId="left"
              stroke={CHART_COLORS.status.info}
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              {referenceLabel && (
                <Label
                  value={referenceLabel}
                  position="insideBottomRight"
                  style={{ fill: CHART_COLORS.status.info, fontSize: 10 }}
                />
              )}
            </ReferenceLine>
          )}
          
          <Bar
            yAxisId="left"
            dataKey={valueKey}
            name={valueUnit ? `Count (${valueUnit})` : 'Count'}
            fill={CHART_COLORS.primary[0]}
            radius={[4, 4, 0, 0]}
            unit={valueUnit}
          />
          
          {showScore && (
            <Bar
              yAxisId="right"
              dataKey={scoreKey}
              name={scoreUnit ? `Score (${scoreUnit})` : 'Score'}
              fill={CHART_COLORS.primary[3]}
              radius={[4, 4, 0, 0]}
              unit={scoreUnit}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MetricComparisonChart;