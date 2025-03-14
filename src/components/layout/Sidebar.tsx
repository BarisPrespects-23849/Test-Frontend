import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Collapse } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Link as LinkIcon,
  ViewCompact as LayoutIcon,
  Palette as AppearanceIcon,
  BarChart as AnalyticsIcon,
  Chat as ChatbotIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Tag as TagIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC<{ mobileOpen: boolean; handleDrawerToggle: () => void }> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const location = useLocation();
  const [channelsOpen, setChannelsOpen] = React.useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleChannelsToggle = () => {
    setChannelsOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Inflow Chat
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {[
          { text: 'Bio Links', icon: <LinkIcon />, path: '/links' },
          { text: 'Layout', icon: <LayoutIcon />, path: '/layout' },
          { text: 'Appearance', icon: <AppearanceIcon />, path: '/appearance' },
          { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analyze' },
          { text: 'Chatbot', icon: <ChatbotIcon />, path: '/chatbot' },
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={path}
              selected={isActive(path)}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={handleChannelsToggle} sx={{ borderRadius: 2, py: 1.5 }}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Channels" />
            {channelsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={channelsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {[
              { text: 'Connect Facebook', icon: <FacebookIcon color="primary" />, path: '/channels/facebook' },
              { text: 'Connect Instagram', icon: <InstagramIcon color="error" />, path: '/channels/instagram' },
              { text: 'Connect Twitter/X', icon: <TwitterIcon color="info" />, path: '/channels/twitter' },
            ].map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={isActive(path)}
                  sx={{ borderRadius: 2, py: 1 }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      <Divider />

      <List sx={{ px: 1, py: 2 }}>
        {[
          { text: 'Schedule Post', icon: <ScheduleIcon />, path: '/publish' },
          { text: 'Manage Tags', icon: <TagIcon />, path: '/manage-tags' },
          { text: 'Manage Channels', icon: <SettingsIcon />, path: '/manage-channels' },
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={path}
              selected={isActive(path)}
              sx={{ borderRadius: 2, py: 1 }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
