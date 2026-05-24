/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar, Toolbar, Box, Button, IconButton, Badge,
  Avatar, Menu, MenuItem, Divider, Stack, Typography,
  Drawer, List, ListItem, useMediaQuery, useTheme, Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, role } = useSelector(s => s.auth);
  const cartItems = useSelector(s => s.cart.items);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/'); setAnchorEl(null); };
  const cartCount = cartItems?.length || 0;
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: scrolled ? 'rgba(13,17,23,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1, minHeight: 68 }}>
        {/* Logo */}
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255,87,34,0.4)',
          }}>🏗️</Box>
          <Box>
            <Typography sx={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '1.15rem',
              background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1,
            }}>BuildMart</Typography>
            <Typography variant="caption" sx={{ color: '#7D8590', lineHeight: 1, fontSize: '0.6rem', letterSpacing: 1 }}>AI MARKETPLACE</Typography>
          </Box>
        </Box>

        {/* Desktop nav */}
        {!isMobile && (
          <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
            {[
              { label: 'Products', path: '/products' },
              { label: 'AI Advisor', path: '/ai-advisor', isAI: true },
            ].map(link => (
              <Button key={link.path} onClick={() => navigate(link.path)}
                startIcon={link.isAI ? <AutoAwesomeIcon sx={{ fontSize: '0.9rem !important' }} /> : null}
                sx={{
                  color: isActive(link.path) ? '#FF5722' : '#7D8590',
                  fontWeight: isActive(link.path) ? 700 : 500,
                  px: 2, borderRadius: 2,
                  background: isActive(link.path) ? 'rgba(255,87,34,0.08)' : 'transparent',
                  '&:hover': { color: '#FF5722', background: 'rgba(255,87,34,0.06)' },
                }}>
                {link.label}
              </Button>
            ))}
            {isAuthenticated && role === 'VENDOR' && (
              <Button startIcon={<DashboardIcon />} onClick={() => navigate('/vendor/dashboard')}
                sx={{ color: '#7D8590', '&:hover': { color: '#FF5722' }, fontWeight: 500 }}>
                Vendor Portal
              </Button>
            )}
            {isAuthenticated && role === 'ADMIN' && (
              <Button onClick={() => navigate('/admin/dashboard')}
                sx={{ color: '#7D8590', '&:hover': { color: '#FF5722' }, fontWeight: 500 }}>
                Admin
              </Button>
            )}
          </Stack>
        )}

        <Box sx={{ flex: isMobile ? 1 : 0 }} />

        {/* Right side */}
        <Stack direction="row" spacing={1} alignItems="center">
          {isAuthenticated ? (
            <>
              <IconButton onClick={() => navigate('/wishlist')} sx={{ color: '#7D8590', '&:hover': { color: '#FF5722' } }}>
                <FavoriteIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton onClick={() => navigate('/cart')} sx={{ color: '#7D8590', '&:hover': { color: '#FF5722' } }}>
                <Badge badgeContent={cartCount} sx={{ '& .MuiBadge-badge': { background: '#FF5722', color: 'white', fontSize: '0.65rem' } }}>
                  <ShoppingCartIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
              <Box onClick={e => setAnchorEl(e.currentTarget)} sx={{
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, ml: 0.5, p: 1,
                borderRadius: 2, '&:hover': { background: 'rgba(255,255,255,0.05)' },
              }}>
                <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF5722, #FF8A65)', fontSize: '0.8rem', fontWeight: 700 }}>
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
                {!isMobile && (
                  <Box>
                    <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.2, fontWeight: 600, color: '#E6EDF3' }}>
                      {user?.firstName || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7D8590', fontSize: '0.6rem' }}>{role}</Typography>
                  </Box>
                )}
              </Box>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1.5, minWidth: 200, background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 } }}>
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography fontWeight={700} sx={{ color: '#E6EDF3' }}>{user?.firstName} {user?.lastName}</Typography>
                  <Typography variant="caption" sx={{ color: '#7D8590' }}>{user?.email}</Typography>
                  <Chip label={role} size="small" sx={{ mt: 0.5, display: 'block', width: 'fit-content', background: 'rgba(255,87,34,0.15)', color: '#FF8A65', fontSize: '0.65rem' }} />
                </Box>
                <Divider />
                {[
                  { icon: <PersonIcon sx={{ fontSize: 16 }} />, label: 'My Profile', path: '/profile' },
                  { icon: <ReceiptIcon sx={{ fontSize: 16 }} />, label: 'My Orders', path: '/orders' },
                  ...(role === 'VENDOR' ? [{ icon: <StorefrontIcon sx={{ fontSize: 16 }} />, label: 'Vendor Dashboard', path: '/vendor/dashboard' }] : []),
                ].map(item => (
                  <MenuItem key={item.path} onClick={() => { navigate(item.path); setAnchorEl(null); }}
                    sx={{ gap: 1.5, color: '#7D8590', '&:hover': { color: '#FF5722', background: 'rgba(255,87,34,0.06)' } }}>
                    {item.icon} {item.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#FF1744', '&:hover': { background: 'rgba(255,23,68,0.08)' } }}>
                  <LogoutIcon sx={{ fontSize: 16 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : !isMobile ? (
            <>
              <Button onClick={() => navigate('/login')} variant="outlined" size="small"
                sx={{ color: '#7D8590', borderColor: 'rgba(255,255,255,0.15)', '&:hover': { borderColor: '#FF5722', color: '#FF5722' } }}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')} variant="contained" size="small">Sign Up Free</Button>
            </>
          ) : null}
          {isMobile && <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#7D8590' }}><MenuIcon /></IconButton>}
        </Stack>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, background: '#161B22', borderLeft: '1px solid rgba(255,255,255,0.08)' } }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏗️</Box>
            <Typography fontWeight={800} sx={{ background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BuildMart AI</Typography>
          </Stack>
          <List disablePadding>
            {[
              { label: 'Home', path: '/' },
              { label: 'Products', path: '/products' },
              { label: '✨ AI Advisor', path: '/ai-advisor' },
              ...(isAuthenticated ? [
                { label: 'My Orders', path: '/orders' },
                { label: 'Cart', path: '/cart' },
                { label: 'Wishlist', path: '/wishlist' },
                { label: 'Profile', path: '/profile' },
              ] : [
                { label: 'Login', path: '/login' },
                { label: 'Register', path: '/register' },
              ]),
              ...(role === 'VENDOR' ? [{ label: 'Vendor Dashboard', path: '/vendor/dashboard' }] : []),
              ...(role === 'ADMIN' ? [{ label: 'Admin Panel', path: '/admin/dashboard' }] : []),
            ].map(item => (
              <ListItem key={item.path} disablePadding>
                <Button fullWidth onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                  sx={{ justifyContent: 'flex-start', color: isActive(item.path) ? '#FF5722' : '#7D8590', py: 1.2, px: 2, borderRadius: 2, '&:hover': { color: '#FF5722', background: 'rgba(255,87,34,0.06)' } }}>
                  {item.label}
                </Button>
              </ListItem>
            ))}
            {isAuthenticated && (
              <ListItem disablePadding>
                <Button fullWidth onClick={handleLogout} sx={{ justifyContent: 'flex-start', color: '#FF1744', py: 1.2, px: 2, mt: 1 }}>Logout</Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
