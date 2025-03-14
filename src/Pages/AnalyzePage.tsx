import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  SelectChangeEvent
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  CalendarViewWeek as CalendarViewWeekIcon,
  CalendarViewMonth as CalendarViewMonthIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import PerformanceMetrics from '../components/features/analyze/PerformanceMetrics';
import AnalyticsChart from '../components/features/analyze/AnalyticsChart';
import EngagementMetrics from '../components/features/engage/EngagementMetrics';

const AnalyzePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [channel, setChannel] = useState('all');

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Fixed type of handleChannelChange
  const handleChannelChange = (event: SelectChangeEvent<string>) => {
    setChannel(event.target.value);
  };

  // Sample metrics data with corrected type for 'format'
  const metrics = [
    {
      title: 'Total Engagement',
      value: 12590,
      previousValue: 10980,
      percentChange: 14.7,
      tooltip: 'Total interactions across all platforms'
    },
    {
      title: 'Average Reach',
      value: 24350,
      previousValue: 21800,
      percentChange: 11.7,
      tooltip: 'Average number of unique users who saw your content'
    },
    {
      title: 'Engagement Rate',
      value: 4.8,
      previousValue: 4.2,
      percentChange: 14.3,
      format: 'percentage' as const, // Fixed type
      colorScale: true,
      tooltip: 'Percentage of reach that engaged with your content'
    },
    {
      title: 'New Followers',
      value: 842,
      previousValue: 756,
      percentChange: 11.4,
      tooltip: 'New followers gained during this period'
    }
  ];

  // Sample platforms for engagement metrics
  const platforms = [
    {
      platform: 'Facebook',
      icon: '/assets/icons/facebook.svg',
      color: '#1877F2',
      stats: {
        comments: 458,
        likes: 3240,
        shares: 182,
        newFollowers: 219
      },
      engagement: 3.8
    },
    {
      platform: 'Instagram',
      icon: '/assets/icons/instagram.svg',
      color: '#E1306C',
      stats: {
        comments: 873,
        likes: 6589,
        shares: 104,
        newFollowers: 542
      },
      engagement: 5.9
    },
    {
      platform: 'Twitter',
      icon: '/assets/icons/twitter.svg',
      color: '#1DA1F2',
      stats: {
        comments: 287,
        likes: 925,
        shares: 344,
        newFollowers: 81
      },
      engagement: 2.7
    }
  ];

  // Sample data for charts
  const engagementData = {
    labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12'],
    datasets: [
      {
        label: 'Likes',
        data: [1200, 1900, 1500, 2500, 2200, 3000, 3200],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
      },
      {
        label: 'Comments',
        data: [400, 650, 550, 700, 650, 800, 950],
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true,
      },
      {
        label: 'Shares',
        data: [200, 350, 250, 450, 400, 550, 600],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
      }
    ]
  };

  const followersData = {
    labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12'],
    datasets: [
      {
        label: 'Facebook',
        data: [5200, 5320, 5450, 5600, 5780, 5920, 6050],
        backgroundColor: '#1877F2',
      },
      {
        label: 'Instagram',
        data: [8200, 8450, 8700, 8950, 9200, 9500, 9750],
        backgroundColor: '#E1306C',
      },
      {
        label: 'Twitter',
        data: [3100, 3180, 3220, 3280, 3310, 3360, 3400],
        backgroundColor: '#1DA1F2',
      }
    ]
  };

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Analytics Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="channel-select-label">Channel</InputLabel>
              <Select
                labelId="channel-select-label"
                value={channel}
                label="Channel"
                onChange={handleChannelChange}
              >
                <MenuItem value="all">All Channels</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
            </FormControl>
            
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
              size="small"
            >
              <ToggleButton value="7d" aria-label="7 days">
                7D
              </ToggleButton>
              <ToggleButton value="30d" aria-label="30 days">
                30D
              </ToggleButton>
              <ToggleButton value="90d" aria-label="90 days">
                90D
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button variant="outlined" startIcon={<DateRangeIcon />} size="small">
              Custom Range
            </Button>
          </Box>
        </Box>

        <PerformanceMetrics metrics={metrics} />
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Engagement Trends
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <AnalyticsChart
                title="Engagement Over Time"
                description="Track likes, comments, and shares across your social channels"
                type="line"
                data={engagementData}
                height={350}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AnalyticsChart
                title="Followers Growth"
                description="Follower count by platform"
                type="bar"
                data={followersData}
                height={350}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Engagement by Platform
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <EngagementMetrics platforms={platforms} period="Last 30 days" />
        </Box>
      </Paper>
    </Container>
  );
};

export default AnalyzePage;
