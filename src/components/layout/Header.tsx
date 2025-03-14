import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();

  const tabs = [
    { label: 'Create', path: '/create' },
    { label: 'Publish', path: '/publish' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'Engage', path: '/engage' },
    { label: 'Start Page', path: '/start-page' },
  ];

  const getActiveTab = () => {
    const index = tabs.findIndex(tab => location.pathname.includes(tab.path));
    return index === -1 ? 1 : index;
  };

  const [value, setValue] = React.useState(getActiveTab);

  React.useEffect(() => {
    setValue(getActiveTab());
  }, [location.pathname]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          sx={{ flexGrow: 1 }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} component={Link} to={tab.path} />
          ))}
        </Tabs>

        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateNextIcon />}
          sx={{ mr: 2, textTransform: 'none' }}
        >
          Start a 14-day free trial
        </Button>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ mr: 2, textTransform: 'none' }}
        >
          New
        </Button>

        <Avatar
          sx={{ ml: 1 }}
          alt="User Profile"
          src="/assets/images/avatar.jpg"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
