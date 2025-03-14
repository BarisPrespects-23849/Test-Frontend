import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useChannelContext } from '../../../context/ChannelContext';
import { useBioLinkContext } from '../../../context/BioLinkContext';
import * as channelService from '../../../services/channelService';

const ChannelBioLink: React.FC = () => {
  const { connectedChannels } = useChannelContext();
  const { activePage } = useBioLinkContext();
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!activePage) {
    return null;
  }

  const bioLinkUrl = `${window.location.origin}/bio/${activePage.slug}`;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FacebookIcon sx={{ color: '#1877F2' }} />;
      case 'instagram':
        return <InstagramIcon sx={{ color: '#E4405F' }} />;
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      default:
        return <LinkIcon />;
    }
  };

  const handleUpdateBioLink = async (channelId: string) => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      await channelService.updateChannelBioLink(channelId, bioLinkUrl);
      setSuccess(`Bio link updated successfully for ${
        connectedChannels.find(c => c.id === channelId)?.name || 'channel'
      }`);
      setTimeout(() => setSuccess(null), 3000);
      setEditingChannelId(null);
    } catch (err) {
      setError('Failed to update bio link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Social Media Bio Links
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Connect your bio link page to your social media profiles.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Your Bio Link URL</Typography>
        <TextField
          fullWidth
          value={bioLinkUrl}
          InputProps={{
            readOnly: true,
          }}
          sx={{ my: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          Use this link in your social media bios to showcase all your important links.
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Connected Channels
      </Typography>
      
      {connectedChannels.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          No channels connected yet. Connect a channel from the Publish section.
        </Typography>
      ) : (
        <List>
          {connectedChannels.map((channel) => (
            <ListItem key={channel.id} sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1, 
              mb: 1 
            }}>
              <ListItemIcon>
                {getPlatformIcon(channel.platform)}
              </ListItemIcon>
              <ListItemText 
                primary={channel.name} 
                secondary={
                  <>
                    {channel.bioLink ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" component="span">
                          Bio link connected
                        </Typography>
                      </Box>
                    ) : 'Not connected'}
                  </>
                }
              />
              <ListItemSecondaryAction>
                {editingChannelId === channel.id ? (
                  <Button 
                    onClick={() => handleUpdateBioLink(channel.id)}
                    color="primary"
                    variant="contained"
                    size="small"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Confirm'}
                  </Button>
                ) : (
                  <IconButton 
                    edge="end" 
                    aria-label="edit"
                    onClick={() => setEditingChannelId(channel.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ChannelBioLink;
