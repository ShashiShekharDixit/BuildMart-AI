/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, Stack, Chip, InputBase, IconButton, Paper, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import BoltIcon from '@mui/icons-material/Bolt';
import { motion, useInView } from 'framer-motion';
import api from '../services/api';

const CATEGORIES = [
  { id: 'CEMENT',    label: 'Cement',    icon: '🏗️', count: '2.4K+ products' },
  { id: 'BRICKS',    label: 'Bricks',    icon: '🧱', count: '1.8K+ products' },
  { id: 'SAND',      label: 'Sand',      icon: '⛱️', count: '900+ products' },
  { id: 'IRON_RODS', label: 'Iron Rods', icon: '🔩', count: '1.2K+ products' },
  { id: 'TILES',     label: 'Tiles',     icon: '🪟', count: '3.1K+ products' },
  { id: 'MARBLE',    label: 'Marble',    icon: '💎', count: '800+ products' },
  { id: 'PIPES',     label: 'Pipes',     icon: '🔧', count: '600+ products' },
  { id: 'AGGREGATE', label: 'Aggregate', icon: '🪨', count: '500+ products' },
];

const DEMO_PRODUCTS = [
  { id: 1, name: 'UltraTech OPC Cement 50kg', category: 'CEMENT', currentPrice: 380, unit: 'bag', vendor: 'Sharma Traders', rating: 4.8, badge: 'Best Seller' },
  { id: 2, name: 'Red Clay Bricks (1000 pcs)', category: 'BRICKS', currentPrice: 7500, unit: '1000 pcs', vendor: 'Ramesh Bricks', rating: 4.6, badge: 'Top Rated' },
  { id: 3, name: 'River Sand Grade A', category: 'SAND', currentPrice: 1200, unit: 'cu.m', vendor: 'Singh Minerals', rating: 4.9, badge: 'Premium' },
  { id: 4, name: 'TMT Steel 12mm (per ton)', category: 'IRON_RODS', currentPrice: 62000, unit: 'ton', vendor: 'Steel Hub', rating: 4.7, badge: 'Verified' },
  { id: 5, name: 'Vitrified Floor Tiles 2x2', category: 'TILES', currentPrice: 42, unit: 'sq ft', vendor: 'Tile World', rating: 4.5, badge: 'New' },
  { id: 6, name: 'Italian Marble Premium', category: 'MARBLE', currentPrice: 280, unit: 'sq ft', vendor: 'Marble Palace', rating: 4.9, badge: 'Luxury' },
];

const STATS = [
  { value: '2,400+', label: 'Verified Vendors' },
  { value: '15K+',   label: 'Products Listed' },
  { value: '120+',   label: 'Cities Covered' },
  { value: '5L+',    label: 'Orders Delivered' },
];

const BADGE_COLORS = { 'Best Seller': '#FF5722', 'Top Rated': '#00BCD4', 'Premium': '#9C27B0', 'Verified': '#00E676', 'New': '#FFB300', 'Luxury': '#F06292' };

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(target.replace(/\D/g, '')) || 0;
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = num / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, num]);
  const formatted = target.includes('L') ? `${count / 100000 < 1 ? count.toLocaleString() : (count / 100000).toFixed(1) + 'L'}+` :
    target.includes('K') ? `${count >= 1000 ? (count/1000).toFixed(0)+'K' : count}+` : `${count.toLocaleString()}+`;
  return <span ref={ref}>{inView ? formatted : '0+'}</span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState(DEMO_PRODUCTS);
  const heroRef = useRef(null);

  useEffect(() => {
    api.get('/products/public/featured').then(r => { if (r.data?.length) setFeatured(r.data); }).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`);
  };

  return (
    <Box sx={{ background: '#0D1117', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <Box ref={heroRef} sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,87,34,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow blobs */}
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,87,34,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,188,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 10 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <Chip icon={<BoltIcon sx={{ fontSize: '0.8rem !important' }} />}
                  label="AI-Powered Construction Marketplace"
                  sx={{ mb: 3, background: 'rgba(255,87,34,0.12)', color: '#FF8A65', border: '1px solid rgba(255,87,34,0.3)', fontWeight: 600 }} />

                <Typography sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 800,
                  lineHeight: 1.1, mb: 2,
                }}>
                  Build Smarter
                  <Box component="span" sx={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #FF5722 30%, #FF9800 60%, #FF5722)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    animation: 'gradient-shift 3s ease infinite',
                  }}>
                    with AI Power
                  </Box>
                </Typography>

                <Typography sx={{ color: '#7D8590', fontSize: '1.1rem', lineHeight: 1.8, mb: 4, maxWidth: 520 }}>
                  Compare prices from 2,400+ verified vendors. AI-powered quantity estimation. Live inventory. Delivered across 120+ cities.
                </Typography>

                {/* Search */}
                <Paper component="form" onSubmit={handleSearch} sx={{
                  display: 'flex', alignItems: 'center', borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)', overflow: 'hidden', maxWidth: 580,
                  '&:hover': { border: '1px solid rgba(255,87,34,0.4)' }, transition: 'all 0.3s',
                }}>
                  <SearchIcon sx={{ ml: 2.5, color: '#7D8590' }} />
                  <InputBase placeholder="Search cement, bricks, sand, tiles..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    sx={{ flex: 1, px: 2, py: 1.5, color: '#E6EDF3', '& input::placeholder': { color: '#7D8590' } }} />
                  <Button type="submit" variant="contained" sx={{ m: 0.8, px: 3, borderRadius: 2 }}>
                    Search
                  </Button>
                </Paper>

                {/* Quick searches */}
                <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
                  {['Cement 50kg', 'TMT Steel', 'River Sand', 'Vitrified Tiles'].map(t => (
                    <Chip key={t} label={t} size="small" onClick={() => navigate(`/products?q=${t}`)}
                      sx={{ cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#7D8590', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,87,34,0.1)', color: '#FF8A65', borderColor: 'rgba(255,87,34,0.3)' } }} />
                  ))}
                </Stack>

                <Stack direction="row" spacing={3} mt={5}>
                  <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/products')} sx={{ px: 4, py: 1.5 }}>
                    Browse Products
                  </Button>
                  <Button variant="outlined" size="large" startIcon={<AutoAwesomeIcon />}
                    onClick={() => navigate('/ai-advisor')}
                    sx={{ px: 4, py: 1.5, color: '#FF8A65', borderColor: 'rgba(255,87,34,0.4)' }}>
                    AI Advisor
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Hero right — floating cards */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
                <Box sx={{ position: 'relative', height: 420 }}>
                  {/* Main card */}
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    <Card sx={{ position: 'absolute', top: 40, left: 0, right: 0, p: 3, background: 'rgba(22,27,34,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,87,34,0.2)' }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,87,34,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🤖</Box>
                        <Box>
                          <Typography fontWeight={700}>AI Material Advisor</Typography>
                          <Typography variant="caption" sx={{ color: '#7D8590' }}>Powered by GPT-4</Typography>
                        </Box>
                      </Stack>
                      <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, p: 2, mb: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography variant="body2" sx={{ color: '#7D8590' }}>"2 floor house, 1500 sq ft"</Typography>
                      </Box>
                      {[
                        { label: 'Cement', value: '720 bags' },
                        { label: 'Bricks', value: '27,000 pcs' },
                        { label: 'Steel', value: '13,500 kg' },
                      ].map(item => (
                        <Stack key={item.label} direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" sx={{ color: '#7D8590' }}>{item.label}</Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: '#FF8A65' }}>{item.value}</Typography>
                        </Stack>
                      ))}
                    </Card>
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, delay: 0.5, repeat: Infinity }}>
                    <Box sx={{ position: 'absolute', bottom: 60, right: -20, background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 2, px: 2, py: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00E676', animation: 'neon-pulse 2s infinite' }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: '#00E676' }}>Live Stock Updates</Typography>
                      </Stack>
                    </Box>
                  </motion.div>

                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, delay: 1, repeat: Infinity }}>
                    <Box sx={{ position: 'absolute', top: 0, right: 20, background: 'rgba(0,188,212,0.15)', border: '1px solid rgba(0,188,212,0.3)', borderRadius: 2, px: 2, py: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VerifiedIcon sx={{ fontSize: 14, color: '#00BCD4' }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: '#00BCD4' }}>2,400+ Verified Vendors</Typography>
                      </Stack>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── STATS ── */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', py: 5, background: 'rgba(255,87,34,0.03)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {STATS.map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      <AnimatedCounter target={s.value} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7D8590', mt: 0.5 }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CATEGORIES ── */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Box mb={6}>
            <Typography variant="overline" sx={{ color: '#FF5722', letterSpacing: 3, fontWeight: 600 }}>EXPLORE</Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800, mt: 0.5 }}>
              Browse by Material
            </Typography>
            <Typography sx={{ color: '#7D8590', mt: 1 }}>Everything you need for construction, in one place</Typography>
          </Box>
        </motion.div>
        <Grid container spacing={2}>
          {CATEGORIES.map((cat, i) => (
            <Grid item xs={6} sm={4} md={3} key={cat.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6, scale: 1.02 }}>
                <Card onClick={() => navigate(`/products?category=${cat.id}`)} sx={{
                  cursor: 'pointer', p: 3, textAlign: 'left',
                  background: 'rgba(22,27,34,0.8)',
                  '&:hover': {
                    background: 'rgba(255,87,34,0.08)',
                    border: '1px solid rgba(255,87,34,0.4)',
                    boxShadow: '0 8px 32px rgba(255,87,34,0.2)',
                  },
                }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{cat.icon}</Typography>
                  <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 0.5 }}>{cat.label}</Typography>
                  <Typography variant="caption" sx={{ color: '#7D8590' }}>{cat.count}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── AI ADVISOR BANNER ── */}
      <Box sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,87,34,0.08) 0%, rgba(0,188,212,0.05) 100%)' }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,87,34,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Chip icon={<AutoAwesomeIcon sx={{ fontSize: '0.8rem !important' }} />} label="Powered by GPT-4"
                  sx={{ mb: 3, background: 'rgba(255,87,34,0.1)', color: '#FF8A65', border: '1px solid rgba(255,87,34,0.25)' }} />
                <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
                  How much material
                  <Box component="span" sx={{ display: 'block', color: '#FF5722' }}>do you actually need?</Box>
                </Typography>
                <Typography sx={{ color: '#7D8590', lineHeight: 1.8, mb: 4 }}>
                  Just describe your project — <Box component="span" sx={{ color: '#E6EDF3', fontWeight: 600 }}>"3-floor house, 2000 sq ft"</Box> — and our AI instantly calculates every material with costs.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large" startIcon={<AutoAwesomeIcon />}
                    onClick={() => navigate('/ai-advisor')} sx={{ px: 4 }}>
                    Try Material Advisor
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate('/ai-advisor')}
                    sx={{ color: '#7D8590', borderColor: 'rgba(255,255,255,0.1)', '&:hover': { color: '#FF5722', borderColor: '#FF5722' } }}>
                    Price Predictor →
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Card sx={{ p: 3, background: 'rgba(22,27,34,0.9)', border: '1px solid rgba(255,87,34,0.2)', backdropFilter: 'blur(20px)' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                    <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF5722, #FF8A65)', fontSize: '0.8rem' }}>AI</Avatar>
                    <Typography variant="body2" sx={{ color: '#7D8590' }}>BuildMart AI · GPT-4</Typography>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00E676', ml: 'auto !important', animation: 'neon-pulse 2s infinite' }} />
                  </Stack>
                  <Box sx={{ background: 'rgba(255,87,34,0.06)', borderRadius: 2, p: 2, mb: 2, borderLeft: '3px solid #FF5722' }}>
                    <Typography variant="body2" sx={{ color: '#E6EDF3' }}>"I need materials for a G+2 house, 1500 sq ft per floor in Lucknow"</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#7D8590', display: 'block', mb: 1.5 }}>AI Estimate:</Typography>
                  {[
                    { label: 'Cement (OPC 53)', value: '1,800 bags', cost: '₹6.84L' },
                    { label: 'Red Bricks', value: '40,500 pcs', cost: '₹3.24L' },
                    { label: 'River Sand', value: '1,080 cu.m', cost: '₹12.96L' },
                    { label: 'TMT Steel (Fe500)', value: '20,250 kg', cost: '₹12.55L' },
                  ].map((item, i) => (
                    <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.8, borderBottom: '1px solid rgba(255,255,255,0.04)', '&:last-child': { borderBottom: 'none' } }}>
                      <Typography variant="body2" sx={{ color: '#7D8590' }}>{item.label}</Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#E6EDF3' }}>{item.value}</Typography>
                        <Typography variant="caption" sx={{ color: '#FF8A65' }}>{item.cost}</Typography>
                      </Stack>
                    </Stack>
                  ))}
                  <Box sx={{ mt: 2, p: 1.5, background: 'rgba(255,87,34,0.08)', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={700}>Total Estimate</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ color: '#FF5722' }}>₹35.59 Lakhs</Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURED PRODUCTS ── */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="overline" sx={{ color: '#FF5722', letterSpacing: 3, fontWeight: 600 }}>FEATURED</Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800 }}>
              Top Products
            </Typography>
          </Box>
          <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')}
            sx={{ color: '#7D8590', '&:hover': { color: '#FF5722' } }}>
            View All
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {featured.slice(0, 6).map((p, i) => (
            <Grid item xs={12} sm={6} md={4} key={p.id || i}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}>
                <Card onClick={() => navigate(`/products/${p.id || i + 1}`)} sx={{ cursor: 'pointer', overflow: 'hidden' }}>
                  <Box sx={{
                    height: 160, background: `radial-gradient(circle at 30% 50%, rgba(255,87,34,0.12), transparent 70%), rgba(22,27,34,0.5)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <Typography sx={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 12px rgba(255,87,34,0.3))' }}>
                      {CATEGORIES.find(c => c.id === p.category)?.icon || '📦'}
                    </Typography>
                    {p.badge && (
                      <Chip label={p.badge} size="small" sx={{
                        position: 'absolute', top: 12, right: 12,
                        background: `${BADGE_COLORS[p.badge]}22`,
                        color: BADGE_COLORS[p.badge],
                        border: `1px solid ${BADGE_COLORS[p.badge]}44`,
                        fontWeight: 700, fontSize: '0.65rem',
                      }} />
                    )}
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ color: '#7D8590', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {CATEGORIES.find(c => c.id === p.category)?.label || p.category}
                    </Typography>
                    <Typography fontWeight={700} sx={{ mt: 0.5, mb: 0.5, color: '#E6EDF3' }} noWrap>{p.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#7D8590' }}>{p.vendor?.businessName || p.vendor}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          ₹{Number(p.currentPrice || p.price).toLocaleString('en-IN')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7D8590' }}>per {p.unit}</Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="caption" sx={{ color: '#FFB300' }}>★</Typography>
                        <Typography variant="caption" fontWeight={700}>{p.rating || 4.5}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── WHY BUILDMART ── */}
      <Box sx={{ py: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline" sx={{ color: '#FF5722', letterSpacing: 3, fontWeight: 600, display: 'block', mb: 1 }}>WHY BUILDMART</Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800, mb: 8 }}>
              Built Different
            </Typography>
          </motion.div>
          <Grid container spacing={3}>
            {[
              { icon: '🤖', title: 'Real AI, Not Fake', desc: 'Actual GPT-4 integration — estimates materials, predicts prices, answers questions. Not just chatbot templates.', color: '#FF5722' },
              { icon: '⚡', title: 'Live Inventory', desc: 'Stock updates in real-time via WebSocket. When a vendor updates stock, you see it instantly — no stale data.', color: '#00BCD4' },
              { icon: '🔒', title: 'Vendor Verified', desc: 'Every vendor goes through GST verification, document checks, and AI fraud detection before being listed.', color: '#00E676' },
              { icon: '🗺️', title: 'Location-Smart', desc: 'Find vendors near your site, see delivery radius, get accurate ETAs. No more guessing delivery costs.', color: '#FFB300' },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card sx={{ p: 3, height: '100%', textAlign: 'left' }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', mb: 2 }}>
                      {f.icon}
                    </Box>
                    <Typography fontWeight={700} mb={1} sx={{ color: '#E6EDF3' }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#7D8590', lineHeight: 1.7 }}>{f.desc}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── VENDOR CTA ── */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Box sx={{
            borderRadius: 4, p: { xs: 4, md: 8 }, textAlign: 'center', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255,87,34,0.12) 0%, rgba(0,188,212,0.08) 100%)',
            border: '1px solid rgba(255,87,34,0.2)',
          }}>
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,87,34,0.15) 0%, transparent 70%)' }} />
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontSize: { xs: '1.8rem', md: '2.8rem' }, fontWeight: 800, mb: 2 }}>
              Are you a Construction Supplier?
            </Typography>
            <Typography sx={{ color: '#7D8590', maxWidth: 540, mx: 'auto', mb: 5, fontSize: '1.05rem', lineHeight: 1.8 }}>
              Join 2,400+ verified vendors. List products, reach thousands of builders, get paid faster.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" onClick={() => navigate('/vendor/register')} sx={{ px: 5 }}>
                Register as Vendor — Free
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/products')}
                sx={{ color: '#7D8590', borderColor: 'rgba(255,255,255,0.1)', px: 4 }}>
                Browse Marketplace
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
