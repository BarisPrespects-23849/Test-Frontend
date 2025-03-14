import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  ThumbUp as ThumbUpIcon,
  Delete as DeleteIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Comment interface
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

interface CommentsListProps {
  comments: Comment[];
  onReply?: (commentId: string, replyText: string) => void;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onReply,
  onLike,
  onDelete
}) => {
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleReplyClick = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, isReplying: !comment.isReplying };
      }
      return comment;
    });
    
    // Initialize reply text if not already
    if (!replyText[commentId]) {
      setReplyText({
        ...replyText,
        [commentId]: ''
      });
    }
  };

  const handleReplyChange = (commentId: string, text: string) => {
    setReplyText({
      ...replyText,
      [commentId]: text
    });
  };

  const handleReplySubmit = (commentId: string) => {
    if (onReply && replyText[commentId]?.trim()) {
      onReply(commentId, replyText[commentId]);
      setReplyText({
        ...replyText,
        [commentId]: ''
      });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, commentId: string) => {
    setMenuAnchorEl({
      ...menuAnchorEl,
      [commentId]: event.currentTarget
    });
  };

  const handleMenuClose = (commentId: string) => {
    setMenuAnchorEl({
      ...menuAnchorEl,
      [commentId]: null
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FacebookIcon color="primary" />;
      case 'instagram':
        return <InstagramIcon color="secondary" />;
      case 'twitter':
        return <TwitterIcon color="info" />;
      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Comments
      </Typography>
      
      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton edge="end" onClick={(e) => handleMenuOpen(e, comment.id)}>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box 
                      sx={{ 
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getPlatformIcon(comment.platform)}
                    </Box>
                  }
                >
                  <Avatar alt={comment.author.name} src={comment.author.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">
                      {comment.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', my: 1 }}
                    >
                      {comment.content}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mt={1}>
                      <Button
                        startIcon={<ReplyIcon />}
                        size="small"
                        onClick={() => handleReplyClick(comment.id)}
                      >
                        Reply
                      </Button>
                      
                      <Button
                        startIcon={<ThumbUpIcon />}
                        size="small"
                        color={comment.liked ? "primary" : "inherit"}
                        onClick={() => onLike && onLike(comment.id)}
                        sx={{ ml: 1 }}
                      >
                        {comment.likes > 0 && comment.likes}
                      </Button>
                    </Box>
                    
                    {comment.isReplying && (
                      <Box sx={{ mt: 2, display: 'flex' }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a reply..."
                          value={replyText[comment.id] || ''}
                          onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => handleReplySubmit(comment.id)}
                          disabled={!replyText[comment.id]?.trim()}
                        >
                          Send
                        </Button>
                      </Box>
                    )}
                  </Box>
                }
              />
              
              <Menu
                anchorEl={menuAnchorEl[comment.id]}
                open={Boolean(menuAnchorEl[comment.id])}
                onClose={() => handleMenuClose(comment.id)}
              >
                <MenuItem onClick={() => {
                  handleReplyClick(comment.id);
                  handleMenuClose(comment.id);
                }}>
                  <ReplyIcon fontSize="small" sx={{ mr: 1 }} />
                  Reply
                </MenuItem>
                <MenuItem onClick={() => {
                  onLike && onLike(comment.id);
                  handleMenuClose(comment.id);
                }}>
                  <ThumbUpIcon fontSize="small" sx={{ mr: 1 }} />
                  {comment.liked ? 'Unlike' : 'Like'}
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    onDelete && onDelete(comment.id);
                    handleMenuClose(comment.id);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </ListItem>
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default CommentsList;
