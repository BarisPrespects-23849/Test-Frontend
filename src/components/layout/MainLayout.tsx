import React, { useState, useCallback } from 'react';
import { Box, CssBaseline, Toolbar, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Help as HelpIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Header handleDrawerToggle={handleDrawerToggle} />

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Outlet />

        <IconButton
          aria-label="Help"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'common.white',
            boxShadow: 3,
            '&:hover': { bgcolor: 'primary.dark', boxShadow: 6 },
            width: 56,
            height: 56,
          }}
        >
          <HelpIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MainLayout;