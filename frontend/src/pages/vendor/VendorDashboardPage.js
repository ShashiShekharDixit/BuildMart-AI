/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Card, CardContent, Typography, Button, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const COLORS = ['#FF5722','#00BCD4','#00E676','#FFB300','#9C27B0'];
const DEMO = {
  totalOrders:128, pendingOrders:12, totalRevenue:485000, totalProducts:24,
  monthlyRevenue:[{month:'Aug',revenue:38000},{month:'Sep',revenue:52000},{month:'Oct',revenue:61000},{month:'Nov',revenue:47000},{month:'Dec',revenue:72000},{month:'Jan',revenue:68000}],
  ordersByCategory:[{name:'Cement',value:35},{name:'Bricks',value:25},{name:'Sand',value:20},{name:'Iron Rods',value:15},{name:'Other',value:5}],
  recentOrders:[
    {orderNumber:'BM-2024-00128',customer:'Rajesh Kumar',amount:18500,status:'CONFIRMED',date:'2024-01-15'},
    {orderNumber:'BM-2024-00127',customer:'Priya Sharma',amount:7200,status:'DELIVERED',date:'2024-01-14'},
    {orderNumber:'BM-2024-00126',customer:'Amit Singh',amount:124000,status:'DISPATCHED',date:'2024-01-13'},
    {orderNumber:'BM-2024-00125',customer:'Sunita Verma',amount:3800,status:'PENDING',date:'2024-01-12'},
  ],
  lowStockProducts:[{name:'TMT Steel 12mm',stock:5,unit:'ton'},{name:'River Sand Grade A',stock:12,unit:'cu.m'}],
};

const STATUS_CHIP = { PENDING:'warning', CONFIRMED:'info', DISPATCHED:'primary', DELIVERED:'success', CANCELLED:'error' };

function StatCard({ title, value, icon, trend }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" sx={{ color: '#7D8590', mb: 0.5 }}>{title}</Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '1.8rem', color: '#E6EDF3' }}>{value}</Typography>
            {trend !== undefined && (
              <Typography variant="caption" sx={{ color: trend > 0 ? '#00E676' : '#FF1744' }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
              </Typography>
            )}
          </Box>
          <Box sx={{ fontSize: '2rem' }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function VendorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(DEMO);

  useEffect(() => { api.get('/vendor/dashboard').then(r => setStats({ ...DEMO, ...r.data })).catch(() => {}); }, []);

  const tooltipStyle = { background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E6EDF3' };

  return (
    <Box sx={{ background: '#0D1117', minHeight: '100vh', pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, rgba(255,87,34,0.15) 0%, rgba(13,17,23,0) 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', py: 5 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" sx={{ color: '#FF5722', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>VENDOR PORTAL</Typography>
              <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '2rem', color: '#E6EDF3', mt: 0.5 }}>
                Welcome back, {user?.firstName || 'Vendor'} 👋
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/vendor/products')} sx={{ color: '#7D8590', borderColor: 'rgba(255,255,255,0.1)' }}>Manage Products</Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/vendor/products')}>Add Product</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Total Revenue" value={`₹${(stats.totalRevenue/1000).toFixed(0)}K`} icon="💰" trend={12} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Total Orders" value={stats.totalOrders} icon="📦" trend={8} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" trend={-3} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Active Products" value={stats.totalProducts} icon="🏗️" trend={5} /></Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography fontWeight={700} sx={{ color: '#E6EDF3' }}>Monthly Revenue</Typography>
                  <Button size="small" onClick={() => navigate('/vendor/analytics')} sx={{ color: '#FF5722' }}>Full Analytics →</Button>
                </Stack>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#FF5722" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 2 }}>Sales by Category</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={stats.ordersByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                      {stats.ordersByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={0.8} mt={1}>
                  {stats.ordersByCategory.map((item, i) => (
                    <Stack key={i} direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                        <Typography variant="caption" sx={{ color: '#7D8590' }}>{item.name}</Typography>
                      </Stack>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#E6EDF3' }}>{item.value}%</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={700} sx={{ color: '#E6EDF3' }}>Recent Orders</Typography>
                  <Button size="small" onClick={() => navigate('/vendor/orders')} sx={{ color: '#FF5722' }}>View All →</Button>
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {['Order #','Customer','Amount','Status','Date'].map(h => (
                          <TableCell key={h} sx={{ color: '#7D8590', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentOrders.map(o => (
                        <TableRow key={o.orderNumber} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                          <TableCell sx={{ color: '#FF5722', fontWeight: 600, fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{o.orderNumber}</TableCell>
                          <TableCell sx={{ color: '#E6EDF3', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{o.customer}</TableCell>
                          <TableCell sx={{ color: '#E6EDF3', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>₹{o.amount.toLocaleString('en-IN')}</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <Chip label={o.status} size="small" color={STATUS_CHIP[o.status] || 'default'} sx={{ fontSize: '0.65rem' }} />
                          </TableCell>
                          <TableCell sx={{ color: '#7D8590', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{o.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <WarningAmberIcon sx={{ color: '#FFB300', fontSize: 20 }} />
                    <Typography fontWeight={700} sx={{ color: '#E6EDF3' }}>Low Stock Alert</Typography>
                  </Stack>
                  {stats.lowStockProducts.map((p, i) => (
                    <Box key={i} mb={1.5}>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" sx={{ color: '#E6EDF3' }}>{p.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#FF1744' }}>{p.stock} {p.unit}</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={15} sx={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: '#FF1744' } }} />
                    </Box>
                  ))}
                  <Button variant="outlined" size="small" fullWidth sx={{ mt: 1, color: '#7D8590', borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => navigate('/vendor/products')}>Update Stock</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 2 }}>Quick Actions</Typography>
                  <Stack spacing={1.5}>
                    {[
                      { label: '➕ Add New Product', path: '/vendor/products' },
                      { label: '📦 Pending Orders', path: '/vendor/orders' },
                      { label: '📊 Full Analytics', path: '/vendor/analytics' },
                    ].map(a => (
                      <Button key={a.label} variant="outlined" fullWidth size="small" onClick={() => navigate(a.path)}
                        sx={{ justifyContent: 'flex-start', color: '#7D8590', borderColor: 'rgba(255,255,255,0.08)', '&:hover': { color: '#FF5722', borderColor: 'rgba(255,87,34,0.3)', background: 'rgba(255,87,34,0.05)' } }}>
                        {a.label}
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
