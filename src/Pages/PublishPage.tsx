import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ListIcon,
  CalendarMonth as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useChannelContext } from '../context/ChannelContext';
import { usePostContext } from '../context/PostContext';
import EmptyState from '../components/common/EmptyState';
import TabPanel from '../components/common/TabPanel';
import CreatePostModal from '../components/features/publish/CreatePostModal';
import ConnectChannelModal from '../components/features/publish/ConnectChannelModal';
import PostCard from '../components/features/publish/PostCard';
import ChannelCard from '../components/features/publish/ChannelCard';

const PublishPageContent: React.FC = () => {
  const { posts, getPostsByStatus, deletePost } = usePostContext();
  const { connectedChannels, disconnectChannel } = useChannelContext();

  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [openPostModal, setOpenPostModal] = useState(false);
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const queuedPosts = useMemo(() => getPostsByStatus('scheduled'), [posts, getPostsByStatus]);
  const draftPosts = useMemo(() => getPostsByStatus('draft'), [posts, getPostsByStatus]);
  const sentPosts = useMemo(() => getPostsByStatus('sent'), [posts, getPostsByStatus]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleCreateNewPost = useCallback(() => {
    setEditingPost(null);
    setOpenPostModal(true);
  }, []);

  const handleEditPost = useCallback((post: any) => {
    setEditingPost(post);
    setOpenPostModal(true);
  }, []);

  const handleDeletePost = useCallback(
    (postId: string) => {
      if (window.confirm('Are you sure you want to delete this post?')) {
        deletePost(postId);
      }
    },
    [deletePost]
  );

  const handleDisconnectChannel = useCallback(
    (channelId: string) => {
      if (window.confirm('Are you sure you want to disconnect this channel?')) {
        disconnectChannel(channelId);
      }
    },
    [disconnectChannel]
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          All Channels
        </Typography>
        <Box>
          <IconButton
            color={viewMode === 'list' ? 'primary' : 'default'}
            onClick={() => setViewMode('list')}
          >
            <ListIcon />
          </IconButton>
          <IconButton
            color={viewMode === 'calendar' ? 'primary' : 'default'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ ml: 2 }}
            onClick={handleCreateNewPost}
          >
            New Post
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Queue (${queuedPosts.length})`} />
          <Tab label={`Drafts (${draftPosts.length})`} />
          <Tab label="Approvals" />
          <Tab label={`Sent (${sentPosts.length})`} />
        </Tabs>

        {[queuedPosts, draftPosts, [], sentPosts].map((postsArray, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            {postsArray.length ? (
              postsArray.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  channels={connectedChannels}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <EmptyState
                icon={<CalendarIcon color="primary" fontSize="large" />}
                title="No posts"
                description="Start scheduling or drafting your posts."
                actionButton={
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNewPost}
                  >
                    Create a Post
                  </Button>
                }
              />
            )}
          </TabPanel>
        ))}
      </Paper>

      <Box>
        <Typography variant="h6" fontWeight="bold">
          Connected Channels
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {connectedChannels.map((channel) => (
            <Grid item xs={12} sm={6} md={4} key={channel.id}>
              <ChannelCard channel={channel} onDisconnect={handleDisconnectChannel} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                p: 2,
                height: '100%',
              }}
            >
              <AddIcon color="primary" fontSize="large" />
              <Button variant="text" onClick={() => setOpenConnectModal(true)}>
                Connect Channel
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <CreatePostModal open={openPostModal} onClose={() => setOpenPostModal(false)} editPost={editingPost} />
      <ConnectChannelModal open={openConnectModal} onClose={() => setOpenConnectModal(false)} />
    </Box>
  );
};

const PublishPage: React.FC = () => (
  <Container maxWidth="xl">
    <PublishPageContent />
  </Container>
);

export default PublishPage;
