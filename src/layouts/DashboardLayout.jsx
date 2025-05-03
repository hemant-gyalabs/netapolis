import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useMediaQuery
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

// Constants
const drawerWidth = 260;

// Styled components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, ismobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !ismobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, ismobile }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#081d4a' : '#121212',
    color: '#ffffff',
    ...(ismobile && {
      width: drawerWidth,
    }),
    ...(!open && !ismobile && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  height: 64,
  color: '#ffffff',
}));

const MainContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#121212',
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  paddingTop: 64, // AppBar height
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

// Main component
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(false);
    }
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };
  
  // Main menu items
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Projects', icon: <BusinessIcon />, path: '/projects' },
    { 
      text: 'Scores', 
      icon: <AssessmentIcon />, 
      path: '/scores',
      subItems: [
        { text: 'Overview', icon: <ShowChartIcon />, path: '/scores' },
        { text: 'Leads', icon: <ShowChartIcon />, path: '/scores/leads' },
        { text: 'Properties', icon: <HomeWorkIcon />, path: '/scores/properties' },
        { text: 'Agents', icon: <EmojiPeopleIcon />, path: '/scores/agents' },
      ]
    },
    { text: 'Team', icon: <PeopleIcon />, path: '/teams' },
  ];
  
  // Secondary menu items
  const secondaryMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];
  
  // Check if the current path is a subpath
  const isSubPath = (mainPath, currentPath) => {
    return currentPath.startsWith(mainPath) && currentPath !== mainPath;
  };
  
  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path || isSubPath(path, location.pathname);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={open} ismobile={isMobile ? 1 : 0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && !isMobile && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {mainMenuItems.find(item => 
              location.pathname === item.path || isSubPath(item.path, location.pathname)
            )?.text || 'Dashboard'}
          </Typography>
          
          {/* Theme toggle */}
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* User menu */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(userMenuAnchor) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(userMenuAnchor) ? 'true' : undefined}
            >
              <Avatar alt={user?.fullName || 'User'} src={user?.profileImage} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>
      
      {/* Drawer */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        ismobile={isMobile ? 1 : 0}
        onClose={handleDrawerClose}
      >
        <LogoWrapper>
          <Typography variant="h5" component="div" className="logo-text">
            NEOPOLIS INFRA
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#ffffff', ml: 2 }}>
            <ChevronLeftIcon />
          </IconButton>
        </LogoWrapper>
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* User info */}
        {open && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar 
              alt={user?.fullName || 'User'} 
              src={user?.profileImage} 
              sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.fullName || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* Main menu */}
        <List component="nav">
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }
                  }} 
                />
              </ListItemButton>
              
              {/* Sub-items */}
              {open && item.subItems && isActive(item.path) && (
                <List disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{
                        py: 1,
                        pl: 7,
                        backgroundColor: isActive(subItem.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                      onClick={() => handleNavigate(subItem.path)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          color: '#ffffff',
                          fontSize: '20px',
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.text} 
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontSize: '0.9rem',
                            fontWeight: isActive(subItem.path) ? 600 : 400,
                          }
                        }} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* Secondary menu */}
        <List>
          {secondaryMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
          
          {/* Logout button */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 102, 0, 0.2)',
                },
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: '#ff6600',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: '#ff6600',
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </StyledDrawer>
      
      {/* Main content */}
      <ContentWrapper>
        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
      
      {/* User menu dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        id="account-menu"
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <Avatar alt={user?.fullName || 'User'} src={user?.profileImage} /> Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ff6600' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications menu */}
      <Menu
        anchorEl={notificationsAnchor}
        id="notifications-menu"
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            width: 360,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2">New project added</Typography>
            <Typography variant="body2" color="text.secondary">
              Residential property in Kokapet has been added
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2">Task assigned to you</Typography>
            <Typography variant="body2" color="text.secondary">
              Document verification for Narsingi project
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yesterday
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2">New lead score updated</Typography>
            <Typography variant="body2" color="text.secondary">
              Lead #1234 has been qualified
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 days ago
            </Typography>
          </Box>
        </MenuItem>
        <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="button" color="primary">View all notifications</Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;