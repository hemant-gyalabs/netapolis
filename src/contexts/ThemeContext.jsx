import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// Create the context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  };
  
  const [mode, setMode] = useState(getInitialMode);
  
  // Toggle theme
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };
  
  // Set theme to specific mode
  const setThemeMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      localStorage.setItem('themeMode', newMode);
      setMode(newMode);
    }
  };
  
  // Apply theme preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);
  
  // Create Material-UI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#081d4a', // Dark Blue
            light: '#2e436e',
            dark: '#050f27',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ff6600', // Orange
            light: '#ff8533',
            dark: '#cc5200',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#e0e0e0',
            secondary: mode === 'light' ? '#666666' : '#a0a0a0',
          },
          success: {
            main: '#28a745',
          },
          error: {
            main: '#dc3545',
          },
          warning: {
            main: '#ffc107',
          },
          info: {
            main: '#17a2b8',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 600,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                borderBottom: mode === 'light' 
                  ? '1px solid #e0e0e0' 
                  : '1px solid #333333',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#081d4a' : '#0a0a0a',
                color: '#ffffff',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );
  
  // Context value
  const value = {
    theme,
    mode,
    toggleTheme,
    setThemeMode,
    isDarkMode: mode === 'dark',
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};