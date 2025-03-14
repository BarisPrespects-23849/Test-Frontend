import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Pinterest as PinterestIcon
} from '@mui/icons-material';
import Modal from '../../common/Modal';
import { useChannelContext } from '../../../context/ChannelContext';
import { PlatformType } from '../../../types/Channel';

interface ConnectChannelModalProps {
  open: boolean;
  onClose: () => void;
}

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: <FacebookIcon color="primary" />, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: <InstagramIcon color="secondary" />, color: '#E1306C' },
  { id: 'twitter', name: 'Twitter / X', icon: <TwitterIcon color="info" />, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
  { id: 'pinterest', name: 'Pinterest', icon: <PinterestIcon color="error" />, color: '#E60023' }
];

const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({ open, onClose }) => {
  const { connectChannel } = useChannelContext();
  const [connecting, setConnecting] = useState<PlatformType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (platform: PlatformType) => {
    setConnecting(platform);
    setError(null);
    
    try {
      // In a real app, this would trigger OAuth flow
      // For now, we'll simulate a successful connection after a delay
      const platformInfo = socialPlatforms.find(p => p.id === platform);
      
      await connectChannel({
        name: `My ${platformInfo?.name} Account`,
        platform,
        connected: true,
        avatar: `/assets/icons/${platform}.svg`,
        stats: {
          followers: Math.floor(Math.random() * 10000),
          engagement: Math.random() * 5
        }
      });
      
      setTimeout(() => {
        setConnecting(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to connect account. Please try again.');
      setConnecting(null);
    }
  };

  const renderConnectButton = (platform: string) => {
    if (connecting === platform) {
      return <CircularProgress size={24} />;
    }
    return (
      <Button 
        variant="outlined"
        disabled={connecting !== null}
        onClick={() => handleConnect(platform as PlatformType)}
      >
        Connect
      </Button>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect a Social Media Account"
    >
      <Box sx={{ py: 1 }}>
        <Typography variant="body1" paragraph>
          Select a platform to connect your social media account:
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <List>
          {socialPlatforms.map((platform) => (
            <React.Fragment key={platform.id}>
              <ListItem
                secondaryAction={renderConnectButton(platform.id)}
                disablePadding
              >
                <ListItemButton disabled={connecting !== null}>
                  <ListItemIcon>{platform.icon}</ListItemIcon>
                  <ListItemText 
                    primary={platform.name} 
                    secondary={`Connect your ${platform.name} account`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} disabled={connecting !== null}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConnectChannelModal;
