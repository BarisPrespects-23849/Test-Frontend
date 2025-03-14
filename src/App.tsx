import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppRouter from './router';
import { AppProvider } from './context/AppContext';
import { ChannelProvider } from './context/ChannelContext';
import { PostProvider } from './context/PostContext';
import { BioLinkProvider } from './context/BioLinkContext';
import { TaskProvider } from './context/TaskContext';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0B76EF',
      light: '#E8F2FE',
    },
    secondary: {
      main: '#667085',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#101828',
      secondary: '#667085',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppProvider>
          <ChannelProvider>
            <PostProvider>
              <TaskProvider>
                <BioLinkProvider>
                  <BrowserRouter>
                    <AppRouter />
                  </BrowserRouter>
                </BioLinkProvider>
              </TaskProvider>
            </PostProvider>
          </ChannelProvider>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
