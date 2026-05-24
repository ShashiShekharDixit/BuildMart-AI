import React from 'react';
import { Box, Container, Grid, Typography, Stack, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const LINKS = {
  'Platform':  [{ label: 'Browse Products', path: '/products' }, { label: 'AI Advisor', path: '/ai-advisor' }, { label: 'Vendor Portal', path: '/vendor/register' }, { label: 'Track Order', path: '/orders' }],
  'Materials': [{ label: 'Cement', path: '/products?category=CEMENT' }, { label: 'Bricks', path: '/products?category=BRICKS' }, { label: 'Iron & Steel', path: '/products?category=IRON_RODS' }, { label: 'Tiles & Marble', path: '/products?category=TILES' }],
  'Support':   [{ label: 'Help Center', path: '/' }, { label: 'Privacy Policy', path: '/' }, { label: 'Terms of Service', path: '/' }, { label: 'Contact Us', path: '/' }],
};

export default function Footer() {
  const navigate = useNavigate();
  return (
    <Box sx={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.06)', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🏗️</Box>
              <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BuildMart AI</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#7D8590', lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
              India's smartest construction material marketplace. AI-powered, vendor-verified, delivered to your site.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[GitHubIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ color: '#7D8590', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, '&:hover': { color: '#FF5722', borderColor: 'rgba(255,87,34,0.3)', background: 'rgba(255,87,34,0.05)' } }}>
                  <Icon sx={{ fontSize: 18 }} />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          {Object.entries(LINKS).map(([title, links]) => (
            <Grid item xs={6} md={2.6} key={title}>
              <Typography variant="caption" sx={{ color: '#7D8590', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, display: 'block', mb: 2 }}>{title}</Typography>
              <Stack spacing={1}>
                {links.map(l => (
                  <Typography key={l.label} variant="body2" onClick={() => navigate(l.path)}
                    sx={{ color: '#7D8590', cursor: 'pointer', '&:hover': { color: '#FF5722' }, transition: 'color 0.2s' }}>
                    {l.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="caption" sx={{ color: '#7D8590' }}>© 2024 BuildMart AI. All rights reserved. Made for Indian builders 🇮🇳</Typography>
          <Stack direction="row" spacing={3}>
            {['🔒 SSL Secured', 'GST Compliant', '🤖 AI-Powered'].map(t => (
              <Typography key={t} variant="caption" sx={{ color: '#7D8590' }}>{t}</Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
