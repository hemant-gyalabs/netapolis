import { Grid } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Payments as PaymentsIcon,
  People as PeopleIcon,
  Check as CheckIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import ScoreMetricCard from './ScoreMetricCard';

const KpiMetricsRow = ({ metrics, loading }) => {
  // Default metrics if not provided
  const defaultMetrics = [
    {
      title: 'Average Lead Score',
      value: 72.4,
      previousValue: 68.9,
      icon: <AssessmentIcon fontSize="small" />,
      color: 'primary',
      progressValue: 72,
      isScoreValue: true,
      helperText: 'Average score of all leads in the system'
    },
    {
      title: 'Conversion Rate',
      value: 24.3,
      previousValue: 21.5,
      unit: '%',
      icon: <TrendingUpIcon fontSize="small" />,
      color: 'success',
      progressValue: 24,
      helperText: 'Percentage of leads that convert to sales'
    },
    {
      title: 'Avg. Property Score',
      value: 80.5,
      previousValue: 77.1,
      icon: <HomeIcon fontSize="small" />,
      color: 'info',
      progressValue: 80,
      isScoreValue: true,
      helperText: 'Average score of all properties in the system'
    },
    {
      title: 'Agent Performance',
      value: 76.2,
      previousValue: 74.8,
      icon: <PersonIcon fontSize="small" />,
      color: 'secondary',
      progressValue: 76,
      isScoreValue: true,
      helperText: 'Average performance score of all agents'
    }
  ];
  
  // Use provided metrics or fallback to defaults
  const displayMetrics = metrics || defaultMetrics;
  
  // Map common icon names to components
  const getIcon = (iconName) => {
    if (!iconName) return null;
    
    const iconMap = {
      assessment: <AssessmentIcon fontSize="small" />,
      trending: <TrendingUpIcon fontSize="small" />,
      person: <PersonIcon fontSize="small" />,
      home: <HomeIcon fontSize="small" />,
      payment: <PaymentsIcon fontSize="small" />,
      people: <PeopleIcon fontSize="small" />,
      check: <CheckIcon fontSize="small" />,
      timeline: <TimelineIcon fontSize="small" />
    };
    
    return iconMap[iconName] || null;
  };
  
  return (
    <Grid container spacing={3}>
      {displayMetrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ScoreMetricCard
            {...metric}
            icon={metric.icon || getIcon(metric.iconName)}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiMetricsRow;