import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box sx={{ position: 'fixed', inset: 0, background: '#0D1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', mb: 3, boxShadow: '0 8px 24px rgba(255,87,34,0.4)' }}>🏗️</Box>
      <CircularProgress size={32} sx={{ color: '#FF5722', mb: 2 }} />
      <Typography variant="body2" sx={{ color: '#7D8590' }}>{message}</Typography>
    </Box>
  );
}
