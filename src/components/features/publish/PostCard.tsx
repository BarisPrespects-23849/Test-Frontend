import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Post } from '../../../types/Post';
import { Channel } from '../../../types/Channel';

interface PostCardProps {
  post: Post;
  channels: Channel[];
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onReschedule?: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  channels,
  onEdit,
  onDelete,
  onReschedule
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
    handleMenuClose();
  };

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(post);
    }
    handleMenuClose();
  };

  // Get appropriate icon for the channel
  const getChannelIcon = (channelId: string) => {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return undefined; // Return undefined instead of null
    
    switch (channel.platform) {
      case 'facebook':
        return <FacebookIcon color="primary" />;
      case 'instagram':
        return <InstagramIcon color="secondary" />;
      case 'twitter':
        return <TwitterIcon color="info" />;
      default:
        return <ShareIcon />;
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 1 }}>
              {post.author.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{post.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(post.createdAt), 'MMM dd, yyyy · h:mm a')}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            {post.status === 'scheduled' && post.scheduledFor && (
              <Chip 
                icon={<ScheduleIcon fontSize="small" />}
                label={`Scheduled for ${format(new Date(post.scheduledFor), 'MMM dd · h:mm a')}`} 
                size="small" 
                color="primary" 
                variant="outlined"
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
        
        <Typography variant="body1" sx={{ mb: 2 }}>
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
        
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
          {post.channelIds.map((channelId) => {
            const channel = channels.find(ch => ch.id === channelId);
            const icon = getChannelIcon(channelId);
            return (
              <Chip
                key={channelId}
                icon={icon}
                label={channel?.name || 'Channel'}
                size="small"
                variant="outlined"
              />
            );
          })}
        </Box>
        
        {post.tags && post.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions>
        <IconButton onClick={handleEdit} size="small" aria-label="edit post">
          <EditIcon fontSize="small" />
        </IconButton>
        
        <IconButton onClick={handleMenuClick} size="small" aria-label="more options">
          <MoreVertIcon fontSize="small" />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Post
          </MenuItem>
          <MenuItem onClick={handleReschedule}>
            <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
            Reschedule
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Post
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

export default PostCard;
