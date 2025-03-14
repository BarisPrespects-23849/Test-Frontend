import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Avatar,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  People as PeopleIcon
} from '@mui/icons-material';

// Engagement stats for a platform
interface PlatformEngagement {
  platform: string;
  icon: string;
  color: string;
  stats: {
    comments: number;
    likes: number;
    shares: number;
    newFollowers: number;
  };
  engagement: number; // Percentage
}

interface EngagementMetricsProps {
  platforms: PlatformEngagement[];
  period: string;
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  platforms,
  period
}) => {
  // Calculate totals
  const totals = platforms.reduce((acc, platform) => {
    return {
      comments: acc.comments + platform.stats.comments,
      likes: acc.likes + platform.stats.likes,
      shares: acc.shares + platform.stats.shares,
      newFollowers: acc.newFollowers + platform.stats.newFollowers
    };
  }, { comments: 0, likes: 0, shares: 0, newFollowers: 0 });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Engagement Metrics
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Summary for {period}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <CommentIcon color="primary" />
            <Typography variant="h5">{totals.comments.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Comments</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <ThumbUpIcon color="primary" />
            <Typography variant="h5">{totals.likes.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Likes</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <ShareIcon color="primary" />
            <Typography variant="h5">{totals.shares.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Shares</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <PeopleIcon color="primary" />
            <Typography variant="h5">{totals.newFollowers.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">New Followers</Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Engagement by Platform
      </Typography>
      
      <Grid container spacing={2}>
        {platforms.map((platform) => (
          <Grid item xs={12} md={6} key={platform.platform}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Avatar 
                src={platform.icon} 
                sx={{ 
                  bgcolor: `${platform.color}20`,
                  color: platform.color,
                  width: 40,
                  height: 40
                }}
              >
                {platform.platform.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box sx={{ flex: 1, mx: 2 }}>
                <Typography variant="subtitle2">
                  {platform.platform}
                </Typography>
                <Box display="flex" gap={2} mt={0.5}>
                  <Tooltip title="Comments">
                    <Box display="flex" alignItems="center">
                      <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {platform.stats.comments.toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  <Tooltip title="Likes">
                    <Box display="flex" alignItems="center">
                      <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {platform.stats.likes.toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  <Tooltip title="Shares">
                    <Box display="flex" alignItems="center">
                      <ShareIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {platform.stats.shares.toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
              
              <Tooltip title="Engagement Rate">
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(platform.engagement, 100)}
                    size={50}
                    color={
                      platform.engagement > 5 ? 'success' :
                      platform.engagement > 2 ? 'primary' :
                      'warning'
                    }
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      fontWeight="bold"
                    >
                      {platform.engagement.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default EngagementMetrics;
