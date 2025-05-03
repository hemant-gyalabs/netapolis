import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ScoresPage from './pages/scores/ScoresPage';
import ScoreDashboardPage from './pages/scores/ScoreDashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import CalculatorsPage from './pages/calculators/CalculatorsPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  // In a real app, we would check if the user is authenticated
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
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
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
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
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              } />
              
              {/* Dashboard Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Score Routes */}
              <Route path="/scores/*" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ScoresPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/scores/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ScoreDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Project Routes */}
              <Route path="/projects/*" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProjectsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/projects/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProjectsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Calculators Routes */}
              <Route path="/calculators/*" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CalculatorsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Default Route - Redirect to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;