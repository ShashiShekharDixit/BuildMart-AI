import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '80vh', background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center" sx={{ p: 4 }}>
        <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '6rem', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</Typography>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#E6EDF3', mb: 1 }}>Page Not Found</Typography>
        <Typography sx={{ color: '#7D8590', mb: 4 }}>The page you're looking for doesn't exist.</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
          <Button variant="outlined" onClick={() => navigate('/products')} sx={{ color: '#7D8590', borderColor: 'rgba(255,255,255,0.15)' }}>Browse Products</Button>
        </Stack>
      </Box>
    </Box>
  );
}
