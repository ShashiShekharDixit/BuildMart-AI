import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { store } from './store';
import { fetchProfile } from './store/slices/authSlice';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AIChatbot from './components/ai/AIChatbot';

const HomePage          = lazy(() => import('./pages/HomePage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage'));
const AIAdvisorPage     = lazy(() => import('./pages/AIAdvisorPage'));
const LoginPage         = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage      = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.RegisterPage })));
const VendorDashboard   = lazy(() => import('./pages/vendor/VendorDashboardPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboardPage'));

const {
  ProductDetailPage, CartPage, OrdersPage, OrderTrackingPage,
  ProfilePage, WishlistPage, CheckoutPage,
  VendorProductsPage, VendorOrdersPage, VendorAnalyticsPage, VendorRegisterPage,
  AdminVendorsPage, AdminUsersPage, AdminOrdersPage,
} = require('./pages/StubPages');

// Dark futuristic theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#FF5722', light: '#FF8A65', dark: '#E64A19', contrastText: '#fff' },
    secondary:  { main: '#00BCD4', light: '#4DD0E1', dark: '#0097A7', contrastText: '#fff' },
    background: { default: '#0D1117', paper: '#161B22' },
    text:       { primary: '#E6EDF3', secondary: '#7D8590' },
    divider:    'rgba(255,255,255,0.08)',
    success:    { main: '#00E676' },
    warning:    { main: '#FFB300' },
    error:      { main: '#FF1744' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10, fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
          boxShadow: '0 4px 20px rgba(255,87,34,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E64A19, #FF5722)',
            boxShadow: '0 6px 28px rgba(255,87,34,0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,87,34,0.5)',
          '&:hover': { borderColor: '#FF5722', background: 'rgba(255,87,34,0.08)', transform: 'translateY(-1px)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#161B22',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { border: '1px solid rgba(255,87,34,0.3)', boxShadow: '0 8px 32px rgba(255,87,34,0.15)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,87,34,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#FF5722' },
          },
          '& label.Mui-focused': { color: '#FF5722' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 8 },
        filled: { background: 'rgba(255,87,34,0.15)', color: '#FF8A65' },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiSelect: {
      styleOverrides: {
        root: { background: 'rgba(255,255,255,0.03)' },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(255,255,255,0.08)' } },
    },
  },
});

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  useEffect(() => { if (isAuthenticated) dispatch(fetchProfile()); }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
          <Route path="/products"      element={<ProductsPage />} />
          <Route path="/products/:id"  element={<ProductDetailPage />} />
          <Route path="/ai-advisor"    element={<AIAdvisorPage />} />
          <Route path="/cart"          element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders"        element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:orderNumber/track" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/wishlist"      element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/vendor/register"  element={<VendorRegisterPage />} />
          <Route path="/vendor/dashboard" element={<ProtectedRoute roles={['VENDOR']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/products"  element={<ProtectedRoute roles={['VENDOR']}><VendorProductsPage /></ProtectedRoute>} />
          <Route path="/vendor/orders"    element={<ProtectedRoute roles={['VENDOR']}><VendorOrdersPage /></ProtectedRoute>} />
          <Route path="/vendor/analytics" element={<ProtectedRoute roles={['VENDOR']}><VendorAnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard"  element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vendors"    element={<ProtectedRoute roles={['ADMIN']}><AdminVendorsPage /></ProtectedRoute>} />
          <Route path="/admin/users"      element={<ProtectedRoute roles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/orders"     element={<ProtectedRoute roles={['ADMIN']}><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <AIChatbot />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
