import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Button,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Comment as CommentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import CommentsList from '../components/features/engage/CommentsList';
import EngagementMetrics from '../components/features/engage/EngagementMetrics';
import TabPanel from '../components/common/TabPanel';
import EmptyState from '../components/common/EmptyState';

// Define the Comment type with proper platform values
interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  liked: boolean;
  likes: number;
  isReplying?: boolean;
}

// Sample comment data with proper types
const sampleComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Love your new product launch! When will it be available in Europe?',
    timestamp: new Date(2025, 2, 10, 14, 30),
    platform: 'facebook',
    liked: false,
    likes: 3
  },
  {
    id: '2',
    author: {
      name: 'Mike Thompson',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    content: 'Just bought this and it\'s amazing! The quality is outstanding.',
    timestamp: new Date(2025, 2, 10, 12, 15),
    platform: 'instagram',
    liked: true,
    likes: 7
  },
  {
    id: '3',
    author: {
      name: 'Jessica Williams',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    content: 'Any chance you\'ll be adding more color options soon?',
    timestamp: new Date(2025, 2, 9, 18, 45),
    platform: 'twitter',
    liked: false,
    likes: 2
  },
  {
    id: '4',
    author: {
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    content: 'I\'ve been using your service for 3 months now. It\'s completely transformed how I manage my social media!',
    timestamp: new Date(2025, 2, 9, 9, 20),
    platform: 'facebook',
    liked: true,
    likes: 12
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

const EngagePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [platform, setPlatform] = useState('all');
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fixed type for handlePlatformChange
  const handlePlatformChange = (event: SelectChangeEvent<string>) => {
    setPlatform(event.target.value);
  };

  const handleReply = (commentId: string, replyText: string) => {
    console.log(`Reply to comment ${commentId}: ${replyText}`);
    // In a real app, we would send this to an API

    // Toggle the isReplying state for the comment
    setComments(
      comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isReplying: false } 
          : comment
      )
    );
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              liked: !comment.liked, 
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1 
            } 
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  // Filter comments based on search and platform
  const filteredComments = comments.filter(comment => {
    const matchesSearch = searchQuery === '' || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = platform === 'all' || comment.platform === (platform as any);
    
    return matchesSearch && matchesPlatform;
  });

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Engagement Hub
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Monitor and respond to comments and messages across all your social channels.
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="engagement tabs">
            <Tab label="Comments" />
            <Tab label="Messages" />
            <Tab label="Mentions" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel id="platform-select-label">Platform</InputLabel>
              <Select
                labelId="platform-select-label"
                value={platform}
                label="Platform"
                onChange={handlePlatformChange}
              >
                <MenuItem value="all">All Platforms</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              placeholder="Search comments"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          {filteredComments.length > 0 ? (
            <CommentsList
              comments={filteredComments}
              onReply={handleReply}
              onLike={handleLike}
              onDelete={handleDeleteComment}
            />
          ) : (
            <EmptyState
              icon={<CommentIcon fontSize="large" />}
              title="No Comments Found"
              description={searchQuery ? "No comments match your search criteria" : "No comments to display"}
              actionButton={
                searchQuery ? (
                  <Button 
                    variant="outlined" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />}
                  >
                    Refresh
                  </Button>
                )
              }
            />
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <EmptyState
            icon={<CommentIcon fontSize="large" />}
            title="Direct Messages"
            description="Coming soon! Manage your direct messages from all platforms in one place."
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <EmptyState
            icon={<CommentIcon fontSize="large" />}
            title="Social Mentions"
            description="Coming soon! Track and respond to mentions of your brand across social media."
          />
        </TabPanel>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Engagement Overview
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <EngagementMetrics platforms={platforms} period="Last 7 days" />
      </Paper>
    </Container>
  );
};

export default EngagePage;
