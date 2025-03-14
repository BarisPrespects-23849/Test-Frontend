import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Chip,
  Grid,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  EventNote as EventNoteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Modal from '../../common/Modal';
import { usePostContext } from '../../../context/PostContext';
import { useChannelContext } from '../../../context/ChannelContext';
import { Post } from '../../../types/Post';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  editPost?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  open, 
  onClose,
  editPost = null
}) => {
  const { createPost, updatePost, schedulePost } = usePostContext();
  const { connectedChannels } = useChannelContext();
  
  const [content, setContent] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<string[]>([]); // For URLs of media that's already uploaded
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{
    content?: string;
    channels?: string;
  }>({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // If editing a post, populate the form
  useEffect(() => {
    if (editPost) {
      setContent(editPost.content);
      setSelectedChannels(editPost.channelIds);
      setTags(editPost.tags);
      if (editPost.media) {
        setMedia(editPost.media);
      }
      if (editPost.scheduledFor) {
        setScheduledDate(new Date(editPost.scheduledFor));
      }
    } else {
      // Reset form for new post
      resetForm();
    }
  }, [editPost, open]);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);
  };

  const handleRemoveExistingMedia = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const validateForm = () => {
    const newErrors: { content?: string; channels?: string } = {};
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (selectedChannels.length === 0) {
      newErrors.channels = 'Select at least one channel';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!validateForm()) return;
    
    setSaving(true);
    setShowSuccess(false);
    
    try {
      // In a real app, you would upload media files to a server first
      // Here we'll just pretend the URLs exist
      const mediaUrls = mediaFiles.map((_, index) => 
        `/assets/images/sample-media-${index + 1}.jpg`
      );
      
      const allMedia = [...media, ...mediaUrls];
      
      if (editPost) {
        // Update existing post
        await updatePost(editPost.id, {
          content,
          channelIds: selectedChannels,
          tags,
          media: allMedia,
          status: isDraft ? 'draft' : 'scheduled'
        });
        
        // If scheduling, update the schedule
        if (!isDraft && scheduledDate) {
          await schedulePost(editPost.id, scheduledDate);
        }
      } else {
        // Create new post
        const post = await createPost({
          content,
          channelIds: selectedChannels,
          status: isDraft ? 'draft' : 'scheduled',
          author: 'Current User',
          tags,
          media: allMedia
        });
        
        // If not a draft and a date is selected, schedule it
        if (!isDraft && scheduledDate) {
          await schedulePost(post.id, scheduledDate);
        }
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        // Close modal after success message is shown
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setSelectedChannels([]);
    setScheduledDate(null);
    setMediaFiles([]);
    setMedia([]);
    setTags([]);
    setTagInput('');
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editPost ? "Edit Post" : "Create New Post"}
      maxWidth="md"
    >
      <Box sx={{ p: 1 }}>
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Post {editPost ? 'updated' : 'created'} successfully!
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="What would you like to share?"
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Media
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {/* Render existing media */}
              {media.map((mediaUrl, index) => (
                <Box
                  key={`existing-${index}`}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={mediaUrl}
                    alt={`Media ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.7)'
                    }}
                    onClick={() => handleRemoveExistingMedia(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              
              {/* Render newly added media files */}
              {mediaFiles.map((file, index) => (
                <Box
                  key={`new-${index}`}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Media ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.7)'
                    }}
                    onClick={() => handleRemoveMedia(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
                sx={{ width: 100, height: 100 }}
              >
                Add Media
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                />
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.channels}>
              <InputLabel id="channels-label">Select Channels</InputLabel>
              <Select
                labelId="channels-label"
                multiple
                value={selectedChannels}
                onChange={(e) => setSelectedChannels(e.target.value as string[])}
                input={<OutlinedInput label="Select Channels" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const channel = connectedChannels.find(c => c.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={channel?.name || value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {connectedChannels.length === 0 ? (
                  <MenuItem disabled>No channels connected</MenuItem>
                ) : (
                  connectedChannels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.channels && <FormHelperText>{errors.channels}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Schedule for"
                value={scheduledDate}
                onChange={(newValue) => setScheduledDate(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    InputProps: {
                      startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'action.active' }} />
                    }
                  } 
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Add Tags (press Enter)"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={saving}
        >
          Save as Draft
        </Button>
        <Box>
          <Button
            onClick={onClose}
            sx={{ mr: 1 }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(false)}
            disabled={saving || !scheduledDate}
          >
            {scheduledDate ? 'Schedule Post' : 'Select a Date to Schedule'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePostModal;
