/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Card, Typography, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Stack, Chip,
  InputAdornment, Skeleton, Pagination, IconButton, Tooltip, Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import TuneIcon from '@mui/icons-material/Tune';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const CATS = [
  { id: '', label: 'All' }, { id: 'CEMENT', label: 'Cement', icon: '🏗️' },
  { id: 'BRICKS', label: 'Bricks', icon: '🧱' }, { id: 'SAND', label: 'Sand', icon: '⛱️' },
  { id: 'IRON_RODS', label: 'Iron Rods', icon: '🔩' }, { id: 'TILES', label: 'Tiles', icon: '🪟' },
  { id: 'MARBLE', label: 'Marble', icon: '💎' }, { id: 'PIPES', label: 'Pipes', icon: '🔧' },
  { id: 'AGGREGATE', label: 'Aggregate', icon: '🪨' }, { id: 'PAINT', label: 'Paint', icon: '🎨' },
  { id: 'HARDWARE', label: 'Hardware', icon: '🔨' },
];

const ICONS = { CEMENT:'🏗️',BRICKS:'🧱',SAND:'⛱️',IRON_RODS:'🔩',TILES:'🪟',MARBLE:'💎',PIPES:'🔧',AGGREGATE:'🪨',PAINT:'🎨',HARDWARE:'🔨' };

const DEMO = [
  { id:1, name:'UltraTech OPC Cement 50kg', category:'CEMENT', currentPrice:380, unit:'bag', vendor:{businessName:'Sharma Traders',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.8, totalRatings:128, inStock:true, stockQuantity:500 },
  { id:2, name:'ACC Gold Cement 50kg', category:'CEMENT', currentPrice:365, unit:'bag', vendor:{businessName:'Kumar Enterprises',city:'Kanpur',verificationStatus:'VERIFIED'}, rating:4.3, totalRatings:89, inStock:true, stockQuantity:200 },
  { id:3, name:'Red Clay Bricks (1000 pcs)', category:'BRICKS', currentPrice:7500, unit:'1000 pcs', vendor:{businessName:'Ramesh Brick Works',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.6, totalRatings:245, inStock:true, stockQuantity:50000 },
  { id:4, name:'Fly Ash Bricks (1000 pcs)', category:'BRICKS', currentPrice:5800, unit:'1000 pcs', vendor:{businessName:'Green Build Co.',city:'Agra',verificationStatus:'VERIFIED'}, rating:4.2, totalRatings:67, inStock:true, stockQuantity:30000 },
  { id:5, name:'River Sand Grade A', category:'SAND', currentPrice:1200, unit:'cubic meter', vendor:{businessName:'Singh Minerals',city:'Allahabad',verificationStatus:'VERIFIED'}, rating:4.9, totalRatings:312, inStock:true, stockQuantity:800 },
  { id:6, name:'M-Sand (Manufactured Sand)', category:'SAND', currentPrice:950, unit:'cubic meter', vendor:{businessName:'RS Aggregates',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.4, totalRatings:156, inStock:true, stockQuantity:400 },
  { id:7, name:'TMT Steel Bars 12mm Fe500 (1 ton)', category:'IRON_RODS', currentPrice:62000, unit:'ton', vendor:{businessName:'Steel Hub India',city:'Kanpur',verificationStatus:'VERIFIED'}, rating:4.8, totalRatings:189, inStock:true, stockQuantity:50 },
  { id:8, name:'TMT Steel Bars 8mm Fe500 (1 ton)', category:'IRON_RODS', currentPrice:58000, unit:'ton', vendor:{businessName:'Iron King',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.5, totalRatings:134, inStock:true, stockQuantity:30 },
  { id:9, name:'20mm Granite Aggregate (1 ton)', category:'AGGREGATE', currentPrice:1100, unit:'ton', vendor:{businessName:'Rock Quarry Co.',city:'Mirzapur',verificationStatus:'VERIFIED'}, rating:4.3, totalRatings:78, inStock:true, stockQuantity:200 },
  { id:10, name:'Vitrified Floor Tiles 600×600mm', category:'TILES', currentPrice:42, unit:'sq ft', vendor:{businessName:'Tile World',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.6, totalRatings:290, inStock:true, stockQuantity:5000 },
  { id:11, name:'Italian Marble Premium (per sq ft)', category:'MARBLE', currentPrice:280, unit:'sq ft', vendor:{businessName:'Marble Palace',city:'Agra',verificationStatus:'VERIFIED'}, rating:4.9, totalRatings:156, inStock:true, stockQuantity:3000 },
  { id:12, name:'UPVC Water Pipe 4-inch (per meter)', category:'PIPES', currentPrice:185, unit:'meter', vendor:{businessName:'Pipe Solutions',city:'Lucknow',verificationStatus:'VERIFIED'}, rating:4.4, totalRatings:92, inStock:true, stockQuantity:1000 },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    sort: 'rating',
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page-1, size: 12, sort: filters.sort };
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      const res = await api.get('/products/public/search', { params });
      const data = res.data.products || [];
      if (data.length) { setProducts(data); setTotalPages(res.data.totalPages || 1); }
      else throw new Error('empty');
    } catch {
      const demo = DEMO.filter(p => {
        if (filters.category && p.category !== filters.category) return false;
        if (filters.q && !p.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
        return true;
      });
      setProducts(demo); setTotalPages(1);
    } finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = e => { e.preventDefault(); setPage(1); loadProducts(); };

  const toggleWishlist = async id => {
    if (wishlist.includes(id)) {
      setWishlist(p => p.filter(x => x !== id));
      try { await api.delete(`/wishlist/${id}`); } catch {}
    } else {
      setWishlist(p => [...p, id]);
      try { await api.post(`/wishlist/${id}`); } catch {}
      toast.success('Added to wishlist!');
    }
  };

  const addToCart = async p => {
    try { await api.post('/cart/add', { productId: p.id, quantity: 1 }); toast.success(`${p.name} added to cart!`); }
    catch { toast.error('Please login to add items to cart.'); }
  };

  return (
    <Box sx={{ background: '#0D1117', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '2rem', mb: 3 }}>
            Construction Materials
          </Typography>
          <Box component="form" onSubmit={handleSearch}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
              <TextField fullWidth placeholder="Search cement, bricks, sand, tiles..."
                value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7D8590' }} /></InputAdornment> }}
                size="small" />
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>Sort by</InputLabel>
                <Select value={filters.sort} label="Sort by" onChange={e => setFilters({ ...filters, sort: e.target.value })}>
                  <MenuItem value="rating">Best Rating</MenuItem>
                  <MenuItem value="price_asc">Price: Low → High</MenuItem>
                  <MenuItem value="price_desc">Price: High → Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" startIcon={<TuneIcon />} sx={{ minWidth: 120 }}>Search</Button>
            </Stack>
          </Box>
          {/* Category pills */}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {CATS.map(c => (
              <Chip key={c.id} label={`${c.icon ? c.icon + ' ' : ''}${c.label}`}
                onClick={() => { setFilters({ ...filters, category: c.id }); setPage(1); }}
                sx={{
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                  background: filters.category === c.id ? 'rgba(255,87,34,0.2)' : 'rgba(255,255,255,0.04)',
                  color: filters.category === c.id ? '#FF8A65' : '#7D8590',
                  border: filters.category === c.id ? '1px solid rgba(255,87,34,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  '&:hover': { background: 'rgba(255,87,34,0.1)', color: '#FF8A65' },
                }} />
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography sx={{ color: '#7D8590' }}>
            <Box component="span" sx={{ color: '#E6EDF3', fontWeight: 700 }}>{products.length}</Box> products found
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {loading ? Array(12).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2, background: 'rgba(255,255,255,0.05)' }} />
            </Grid>
          )) : products.map((product, i) => (
            <Grid item xs={12} sm={6} md={4} key={product.id || i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -6 }}>
                <Card sx={{ overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Product image area */}
                  <Box sx={{
                    height: 170, position: 'relative',
                    background: `radial-gradient(circle at 30% 40%, rgba(255,87,34,0.1), transparent 60%), #161B22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} onClick={() => navigate(`/products/${product.id}`)}>
                    <Typography sx={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 12px rgba(255,87,34,0.25))' }}>
                      {ICONS[product.category] || '📦'}
                    </Typography>
                    {/* Top-right buttons */}
                    <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 10, right: 10 }}>
                      <Tooltip title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}>
                        <IconButton size="small"
                          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                          sx={{ background: 'rgba(13,17,23,0.7)', backdropFilter: 'blur(10px)', '&:hover': { background: 'rgba(255,87,34,0.2)' } }}>
                          {wishlist.includes(product.id)
                            ? <FavoriteIcon sx={{ fontSize: 16, color: '#FF5722' }} />
                            : <FavoriteBorderIcon sx={{ fontSize: 16, color: '#7D8590' }} />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    {/* Stock badge */}
                    <Chip
                      label={product.inStock ? `${product.stockQuantity?.toLocaleString()} ${product.unit}` : 'Out of Stock'}
                      size="small"
                      sx={{
                        position: 'absolute', bottom: 10, left: 10, fontSize: '0.65rem', fontWeight: 600,
                        background: product.inStock ? 'rgba(0,230,118,0.15)' : 'rgba(255,23,68,0.15)',
                        color: product.inStock ? '#00E676' : '#FF1744',
                        border: product.inStock ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(255,23,68,0.3)',
                      }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ color: '#FF5722', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, mb: 0.5, display: 'block' }}>
                      {CATS.find(c => c.id === product.category)?.label || product.category}
                    </Typography>
                    <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 0.5, lineHeight: 1.3 }}
                      onClick={() => navigate(`/products/${product.id}`)}>
                      {product.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                      {product.vendor?.verificationStatus === 'VERIFIED' &&
                        <VerifiedIcon sx={{ fontSize: 12, color: '#00BCD4' }} />}
                      <Typography variant="caption" sx={{ color: '#7D8590' }}>{product.vendor?.businessName}</Typography>
                      {product.vendor?.city && <>
                        <Typography variant="caption" sx={{ color: '#7D8590' }}>·</Typography>
                        <LocationOnIcon sx={{ fontSize: 11, color: '#7D8590' }} />
                        <Typography variant="caption" sx={{ color: '#7D8590' }}>{product.vendor.city}</Typography>
                      </>}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
                      <Rating value={product.rating || 0} precision={0.5} size="small" readOnly
                        sx={{ '& .MuiRating-icon': { color: '#FFB300' }, fontSize: '0.9rem' }} />
                      <Typography variant="caption" sx={{ color: '#7D8590' }}>({product.totalRatings || 0})</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
                      <Box>
                        <Typography sx={{
                          fontWeight: 800, fontSize: '1.15rem',
                          background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>₹{Number(product.currentPrice).toLocaleString('en-IN')}</Typography>
                        <Typography variant="caption" sx={{ color: '#7D8590' }}>per {product.unit}</Typography>
                      </Box>
                      <Button variant="contained" size="small" startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.9rem !important' }} />}
                        onClick={e => { e.stopPropagation(); addToCart(product); }}
                        sx={{ py: 0.8, px: 1.5, fontSize: '0.8rem' }}>
                        Add
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {!loading && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>🔍</Typography>
            <Typography variant="h6" sx={{ color: '#E6EDF3', mb: 1 }}>No products found</Typography>
            <Typography sx={{ color: '#7D8590', mb: 3 }}>Try adjusting your search or category filter</Typography>
            <Button variant="outlined" onClick={() => setFilters({ q: '', category: '', sort: 'rating' })}>Clear Filters</Button>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)}
              sx={{
                '& .MuiPaginationItem-root': { color: '#7D8590', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 },
                '& .Mui-selected': { background: 'rgba(255,87,34,0.2) !important', color: '#FF5722 !important', borderColor: 'rgba(255,87,34,0.4) !important' },
              }} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
