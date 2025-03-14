import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Post } from '../../../types/Post';
import { useChannelContext } from '../../../context/ChannelContext';
import { usePostContext } from '../../../context/PostContext';

interface PostsListProps {
  posts: Post[];
}

const PostsList: React.FC<PostsListProps> = ({ posts }) => {
  const { channels } = useChannelContext();
  const { deletePost } = usePostContext();

  const getChannelName = (channelId: string) => {
    const channel = channels.find(ch => ch.id === channelId);
    return channel?.name || 'Unknown Channel';
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const getPlatformIcon = (channelId: string) => {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return null;
    
    switch (channel.platform) {
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📷';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      case 'pinterest':
        return '📌';
      default:
        return '🌐';
    }
  };

  if (posts.length === 0) {
    return (
      <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
        No posts to display.
      </Typography>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1 }}>
                  {post.author.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{post.author}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                  </Typography>
                </Box>
              </Box>
              <Box>
                {post.status === 'scheduled' && post.scheduledFor && (
                  <Chip 
                    label={`Scheduled for ${format(new Date(post.scheduledFor), 'MMM d, h:mm a')}`} 
                    size="small" 
                    color="primary" 
                  />
                )}
                {post.status === 'draft' && (
                  <Chip label="Draft" size="small" />
                )}
                {post.status === 'sent' && (
                  <Chip label="Sent" size="small" color="success" />
                )}
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ my: 2 }}>
              {post.content}
            </Typography>
            
            {post.media && post.media.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {post.media.map((media, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={media}
                    alt={`Post media ${index}`}
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ))}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
              {post.channelIds.map((channelId) => (
                <Chip
                  key={channelId}
                  label={getChannelName(channelId)}
                  size="small"
                  avatar={<Avatar>{getPlatformIcon(channelId)}</Avatar>}
                />
              ))}
            </Box>
            
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              size="small"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => handleDeletePost(post.id)}
            >
              Delete
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default PostsList;
