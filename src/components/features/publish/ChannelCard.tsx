import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  LinkOff as LinkOffIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Channel } from '../../../types/Channel';

interface ChannelCardProps {
  channel: Channel;
  onDisconnect?: (channelId: string) => void;
  onSettings?: (channelId: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onDisconnect,
  onSettings
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect(channel.id);
    }
    handleClose();
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings(channel.id);
    }
    handleClose();
  };

  // Platform-specific styling
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '#1877F2';
      case 'instagram':
        return '#E1306C';
      case 'twitter':
        return '#1DA1F2';
      case 'linkedin':
        return '#0077B5';
      case 'pinterest':
        return '#E60023';
      default:
        return '#757575';
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center">
            <Avatar
              src={channel.avatar}
              sx={{
                bgcolor: getPlatformColor(channel.platform),
                width: 50,
                height: 50,
                mr: 2
              }}
            >
              {channel.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {channel.name}
              </Typography>
              <Chip
                label={channel.platform.charAt(0).toUpperCase() + channel.platform.slice(1)}
                size="small"
                sx={{
                  bgcolor: getPlatformColor(channel.platform) + '20',
                  color: getPlatformColor(channel.platform),
                  fontWeight: 500,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>
          
          <IconButton onClick={handleClick} size="small">
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSettings}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleDisconnect}>
              <LinkOffIcon fontSize="small" sx={{ mr: 1 }} />
              Disconnect
            </MenuItem>
          </Menu>
        </Box>
        
        {channel.stats && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="text.secondary">
                Followers
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {channel.stats.followers.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="text.secondary">
                Engagement Rate
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {channel.stats.engagement.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            color="primary"
          >
            View Analytics
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;
