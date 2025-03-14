import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

interface MetricProps {
  title: string;
  value: number | string;
  previousValue?: number | string;
  percentChange?: number;
  tooltip?: string;
  format?: 'number' | 'percentage' | 'currency';
  colorScale?: boolean;
}

interface PerformanceMetricsProps {
  metrics: MetricProps[];
}

const Metric: React.FC<MetricProps> = ({
  title,
  value,
  previousValue,
  percentChange,
  tooltip,
  format = 'number',
  colorScale = false
}) => {
  // Format the value based on the format type
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  // Determine trend icon and color
  const getTrendIcon = () => {
    if (percentChange === undefined) return null;
    
    if (percentChange > 0) {
      return <TrendingUpIcon color="success" fontSize="small" />;
    } else if (percentChange < 0) {
      return <TrendingDownIcon color="error" fontSize="small" />;
    } else {
      return <TrendingFlatIcon color="action" fontSize="small" />;
    }
  };

  const getTrendColor = () => {
    if (percentChange === undefined) return 'text.secondary';
    
    if (percentChange > 0) {
      return 'success.main';
    } else if (percentChange < 0) {
      return 'error.main';
    } else {
      return 'text.secondary';
    }
  };

  // Scale color for value on a gradient (useful for engagement rates, etc.)
  const getColorScale = (val: number) => {
    if (!colorScale || typeof val !== 'number') return undefined;
    
    if (val >= 7) return 'success.main';
    if (val >= 4) return 'success.light';
    if (val >= 2) return 'warning.light';
    return 'error.light';
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip}>
            <IconButton size="small">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <Typography variant="h4" component="div" sx={{ color: getColorScale(Number(value)) }}>
        {formatValue(value)}
      </Typography>
      
      {(previousValue !== undefined || percentChange !== undefined) && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {getTrendIcon()}
          <Typography 
            variant="body2" 
            color={getTrendColor()}
            sx={{ ml: 0.5 }}
          >
            {percentChange !== undefined && `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`}
            {previousValue !== undefined && ` from ${formatValue(previousValue)}`}
          </Typography>
        </Box>
      )}
      
      {colorScale && typeof value === 'number' && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(value * 10, 100)} 
            color={value >= 4 ? "success" : value >= 2 ? "warning" : "error"}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}
    </Paper>
  );
};

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Metric {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PerformanceMetrics;
