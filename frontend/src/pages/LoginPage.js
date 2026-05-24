import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Card, Typography, TextField, Button, Stack, Divider, InputAdornment, IconButton, Alert, CircularProgress, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

const BG = {
  position: 'fixed', inset: 0, zIndex: 0,
  background: '#0D1117',
  '&::before': { content: '""', position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,87,34,0.08) 0%, transparent 70%)', filter: 'blur(40px)' },
  '&::after': { content: '""', position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,188,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' },
};

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', py: 6 }}>
      <Box sx={BG} />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(255,87,34,0.3)' }}>🏗️</Box>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BuildMart AI</Typography>
            <Typography variant="h5" fontWeight={700} mt={2} sx={{ color: '#E6EDF3' }}>{title}</Typography>
            <Typography sx={{ color: '#7D8590', mt: 0.5 }}>{subtitle}</Typography>
          </Box>
          <Card sx={{ p: 4, background: 'rgba(22,27,34,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {children}
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, role } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(role === 'VENDOR' ? '/vendor/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/');
  }, [isAuthenticated, role, navigate]);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields.'); return; }
    const r = await dispatch(login(form));
    if (login.fulfilled.match(r)) toast.success('Welcome back! 🏗️');
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your BuildMart account">
      {error && <Alert severity="error" sx={{ mb: 3, background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)', color: '#FF6B6B' }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Email Address" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} sx={{ mb: 1 }}
          InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} sx={{ color: '#7D8590' }}>{showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment>) }} />
        <Box textAlign="right" mb={3}>
          <Typography variant="body2" sx={{ color: '#FF5722', cursor: 'pointer', display: 'inline' }}>Forgot password?</Typography>
        </Box>
        <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}
          startIcon={loading && <CircularProgress size={18} color="inherit" />}
          sx={{ py: 1.5, mb: 3 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
      <Divider sx={{ mb: 2.5 }}><Typography variant="caption" sx={{ color: '#7D8590', px: 1 }}>Demo accounts</Typography></Divider>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
        {[
          { label: 'Customer', email: 'customer@demo.com', color: '#00E676' },
          { label: 'Vendor', email: 'vendor@demo.com', color: '#FF5722' },
          { label: 'Admin', email: 'admin@demo.com', color: '#00BCD4' },
        ].map(d => (
          <Chip key={d.label} label={d.label} size="small"
            onClick={() => setForm({ email: d.email, password: 'Demo@1234' })}
            sx={{ cursor: 'pointer', background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30`, fontWeight: 600 }} />
        ))}
      </Stack>
      <Typography textAlign="center" mt={3} variant="body2" sx={{ color: '#7D8590' }}>
        No account?{' '}
        <Typography component={Link} to="/register" sx={{ color: '#FF5722', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Sign up free
        </Typography>
      </Typography>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await api.post('/auth/register', data);
      setSuccess(true);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <AuthLayout title="Check your email" subtitle="Verification link sent!">
      <Box textAlign="center" py={3}>
        <Typography sx={{ fontSize: '4rem', mb: 2 }}>✉️</Typography>
        <Typography sx={{ color: '#7D8590', mb: 3 }}>We sent a verification link to <Box component="span" sx={{ color: '#E6EDF3' }}>{form.email}</Box></Typography>
        <Button variant="contained" onClick={() => navigate('/login')} fullWidth sx={{ py: 1.5 }}>Go to Login</Button>
      </Box>
    </AuthLayout>
  );

  return (
    <AuthLayout title="Create account" subtitle="Join India's smartest construction marketplace">
      <Typography variant="body2" fontWeight={600} mb={1.5} sx={{ color: '#7D8590' }}>I am a:</Typography>
      <Stack direction="row" spacing={2} mb={3}>
        {[{ value: 'CUSTOMER', label: '🏠 Customer / Builder' }, { value: 'VENDOR', label: '🏭 Vendor / Supplier' }].map(r => (
          <Box key={r.value} flex={1} onClick={() => setForm({ ...form, role: r.value })} sx={{
            border: '1px solid', borderRadius: 2, p: 2, cursor: 'pointer', textAlign: 'center',
            borderColor: form.role === r.value ? '#FF5722' : 'rgba(255,255,255,0.1)',
            background: form.role === r.value ? 'rgba(255,87,34,0.08)' : 'transparent',
            transition: 'all 0.2s',
          }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: form.role === r.value ? '#FF5722' : '#7D8590' }}>{r.label}</Typography>
          </Box>
        ))}
      </Stack>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField fullWidth label="First Name" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <TextField fullWidth label="Last Name" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </Stack>
        <TextField fullWidth label="Email" type="email" required sx={{ mb: 2 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <TextField fullWidth label="Phone (+91)" sx={{ mb: 2 }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} inputProps={{ maxLength: 10 }} />
        <TextField fullWidth label="Password" required type={showPass ? 'text' : 'password'} helperText="Min 8 characters" sx={{ mb: 2 }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} sx={{ color: '#7D8590' }}>{showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }} />
        <TextField fullWidth label="Confirm Password" required type="password" sx={{ mb: 3 }} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
        <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}
          startIcon={loading && <CircularProgress size={18} color="inherit" />} sx={{ py: 1.5 }}>
          {loading ? 'Creating account...' : `Create ${form.role === 'VENDOR' ? 'Vendor' : 'Customer'} Account`}
        </Button>
      </Box>
      <Typography textAlign="center" mt={3} variant="body2" sx={{ color: '#7D8590' }}>
        Have an account?{' '}
        <Typography component={Link} to="/login" sx={{ color: '#FF5722', fontWeight: 600, textDecoration: 'none' }}>Sign in</Typography>
      </Typography>
    </AuthLayout>
  );
}

export default LoginPage;
