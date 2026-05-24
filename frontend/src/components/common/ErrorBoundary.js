import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('BuildMart Error:', error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Box sx={{ minHeight: '100vh', background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center" sx={{ p: 4 }}>
          <Typography sx={{ fontSize: '5rem', mb: 2 }}>⚠️</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#E6EDF3', mb: 1 }}>Something went wrong</Typography>
          <Typography sx={{ color: '#7D8590', mb: 4 }}>An unexpected error occurred. Please refresh the page.</Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => window.location.reload()}>Refresh Page</Button>
            <Button variant="outlined" onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}>Go Home</Button>
          </Stack>
        </Box>
      </Box>
    );
  }
}
