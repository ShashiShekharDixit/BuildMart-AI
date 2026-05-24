/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Card, CardContent, Typography, Button, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Tabs, Tab } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '../../services/api';

const DEMO = {
  totalUsers:4821, totalVendors:312, totalOrders:18456, totalRevenue:28450000,
  pendingVendorApprovals:18, fraudAlerts:3, activeOrders:234,
  platformGrowth:[
    {month:'Aug',users:2100,orders:890,revenue:1200000},{month:'Sep',users:2800,orders:1200,revenue:1800000},
    {month:'Oct',users:3200,orders:1600,revenue:2400000},{month:'Nov',users:3900,orders:2100,revenue:3100000},
    {month:'Dec',users:4400,orders:2800,revenue:4200000},{month:'Jan',users:4821,orders:3200,revenue:4850000},
  ],
  topMaterials:[
    {name:'Cement',revenue:8200000},{name:'Bricks',revenue:6100000},{name:'Sand',revenue:3400000},
    {name:'Iron Rods',revenue:5800000},{name:'Tiles',revenue:2100000},
  ],
  pendingVendors:[
    {id:1,businessName:'Gupta Steel Works',city:'Kanpur',category:'Iron Rods',submittedAt:'2024-01-15',docsStatus:'Complete'},
    {id:2,businessName:'Singh Marble House',city:'Agra',category:'Marble',submittedAt:'2024-01-14',docsStatus:'Complete'},
    {id:3,businessName:'Verma Cement Depot',city:'Lucknow',category:'Cement',submittedAt:'2024-01-13',docsStatus:'Partial'},
  ],
  fraudAlertsList:[
    {id:1,type:'PRICE_DUMP',vendor:'Unknown Vendor 1',risk:'HIGH',detail:'Cement listed at ₹120/bag (market: ₹380)'},
    {id:2,type:'FAKE_STOCK',vendor:'Quick Build Supplies',risk:'MEDIUM',detail:'5M bricks listed by new unverified vendor'},
    {id:3,type:'SPAM_REVIEW',vendor:'Rapid Materials',risk:'LOW',detail:'48 reviews posted within 2 hours'},
  ],
};

const tooltipStyle = { background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E6EDF3' };

function StatCard({ title, value, icon, badge }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" sx={{ color: '#7D8590', mb: 0.5 }}>{title}</Typography>
            <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '1.8rem', color: '#E6EDF3' }}>{value}</Typography>
          </Box>
          <Box sx={{ fontSize: '2rem' }}>{icon}</Box>
        </Stack>
        {badge && <Chip label={badge.label} color={badge.color} size="small" sx={{ mt: 1, fontSize: '0.65rem' }} />}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(DEMO);
  const [tab, setTab] = useState(0);

  useEffect(() => { api.get('/admin/dashboard').then(r => setData({ ...DEMO, ...r.data })).catch(() => {}); }, []);

  const handleVendorAction = async (vendorId, action) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/verify`, { status: action });
      setData(prev => ({ ...prev, pendingVendors: prev.pendingVendors.filter(v => v.id !== vendorId), pendingVendorApprovals: prev.pendingVendorApprovals - 1 }));
    } catch {}
  };

  return (
    <Box sx={{ background: '#0D1117', minHeight: '100vh', pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, rgba(13,17,23,0) 60%)', borderBottom: '1px solid rgba(255,255,255,0.06)', py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ color: '#00BCD4', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>ADMIN PANEL</Typography>
          <Typography sx={{ fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '2rem', color: '#E6EDF3', mt: 0.5 }}>Platform Dashboard</Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {data.fraudAlerts > 0 && (
          <Alert severity="error" icon={<SecurityIcon />} sx={{ mb: 3, background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.2)', color: '#FF6B6B' }}
            action={<Button color="inherit" size="small" onClick={() => setTab(2)}>Review</Button>}>
            <strong>{data.fraudAlerts} AI Fraud Alerts</strong> require immediate attention.
          </Alert>
        )}
        {data.pendingVendorApprovals > 0 && (
          <Alert severity="warning" sx={{ mb: 3, background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)', color: '#FFB300' }}
            action={<Button color="inherit" size="small" onClick={() => setTab(1)}>Review</Button>}>
            <strong>{data.pendingVendorApprovals} vendor registrations</strong> pending approval.
          </Alert>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={6} md={3}><StatCard title="Total Users" value={data.totalUsers.toLocaleString()} icon="👥" /></Grid>
          <Grid item xs={6} md={3}><StatCard title="Verified Vendors" value={data.totalVendors.toLocaleString()} icon="🏭" badge={{ label: `${data.pendingVendorApprovals} pending`, color: 'warning' }} /></Grid>
          <Grid item xs={6} md={3}><StatCard title="Total Orders" value={data.totalOrders.toLocaleString()} icon="📦" /></Grid>
          <Grid item xs={6} md={3}><StatCard title="Platform Revenue" value={`₹${(data.totalRevenue/10000000).toFixed(1)}Cr`} icon="💰" /></Grid>
        </Grid>

        <Card>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', px: 2,
              '& .MuiTab-root': { color: '#7D8590', fontWeight: 600 },
              '& .Mui-selected': { color: '#FF5722 !important' },
              '& .MuiTabs-indicator': { background: '#FF5722' },
            }}>
            <Tab label="📊 Growth Analytics" />
            <Tab label={`✅ Vendor Approvals (${data.pendingVendorApprovals})`} />
            <Tab label={`🔍 Fraud Alerts (${data.fraudAlerts})`} />
            <Tab label="🏆 Top Products" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {tab === 0 && (
              <Box>
                <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 3 }}>Platform Growth — Last 6 Months</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body2" sx={{ color: '#7D8590', mb: 1 }}>Revenue Trend</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data.platformGrowth}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF5722" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${(v/100000).toFixed(1)}L`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#FF5722" strokeWidth={2} fill="url(#revGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#7D8590', mb: 1 }}>User Growth</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={data.platformGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7D8590', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="users" stroke="#00BCD4" strokeWidth={2} dot={{ fill: '#00BCD4', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 3 }}>Pending Vendor Registrations</Typography>
                {data.pendingVendors.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <VerifiedIcon sx={{ fontSize: 48, color: '#00E676', mb: 1 }} />
                    <Typography sx={{ color: '#7D8590' }}>All vendor approvals are up to date!</Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {['Business Name','City','Category','Documents','Submitted','Actions'].map(h => (
                            <TableCell key={h} sx={{ color: '#7D8590', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.pendingVendors.map(v => (
                          <TableRow key={v.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                            <TableCell sx={{ color: '#E6EDF3', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{v.businessName}</TableCell>
                            <TableCell sx={{ color: '#7D8590', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{v.city}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><Chip label={v.category} size="small" sx={{ background: 'rgba(255,87,34,0.1)', color: '#FF8A65' }} /></TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <Chip label={v.docsStatus} size="small" color={v.docsStatus === 'Complete' ? 'success' : 'warning'} sx={{ fontSize: '0.65rem' }} />
                            </TableCell>
                            <TableCell sx={{ color: '#7D8590', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{v.submittedAt}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <Stack direction="row" spacing={1}>
                                <Button size="small" variant="contained" color="success" sx={{ fontSize: '0.75rem', py: 0.5 }} onClick={() => handleVendorAction(v.id, 'VERIFIED')}>Approve</Button>
                                <Button size="small" variant="outlined" color="error" sx={{ fontSize: '0.75rem', py: 0.5 }} onClick={() => handleVendorAction(v.id, 'REJECTED')}>Reject</Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 3 }}>🔍 AI Fraud Detection Alerts</Typography>
                <Stack spacing={2}>
                  {data.fraudAlertsList.map(alert => (
                    <Box key={alert.id} sx={{
                      p: 2.5, borderRadius: 2, border: '1px solid',
                      borderColor: alert.risk === 'HIGH' ? 'rgba(255,23,68,0.3)' : alert.risk === 'MEDIUM' ? 'rgba(255,179,0,0.3)' : 'rgba(255,255,255,0.08)',
                      background: alert.risk === 'HIGH' ? 'rgba(255,23,68,0.06)' : alert.risk === 'MEDIUM' ? 'rgba(255,179,0,0.06)' : 'rgba(255,255,255,0.02)',
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Chip label={alert.type} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#7D8590', fontSize: '0.65rem' }} />
                            <Chip label={`${alert.risk} RISK`} size="small"
                              sx={{ fontSize: '0.65rem', background: alert.risk === 'HIGH' ? 'rgba(255,23,68,0.15)' : alert.risk === 'MEDIUM' ? 'rgba(255,179,0,0.15)' : 'rgba(255,255,255,0.05)',
                                color: alert.risk === 'HIGH' ? '#FF1744' : alert.risk === 'MEDIUM' ? '#FFB300' : '#7D8590' }} />
                          </Stack>
                          <Typography fontWeight={700} sx={{ color: '#E6EDF3' }}>{alert.vendor}</Typography>
                          <Typography variant="body2" sx={{ color: '#7D8590', mt: 0.5 }}>{alert.detail}</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" color="error" sx={{ fontSize: '0.75rem' }}>Suspend</Button>
                          <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem', color: '#7D8590', borderColor: 'rgba(255,255,255,0.1)' }}>Dismiss</Button>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {tab === 3 && (
              <Box>
                <Typography fontWeight={700} sx={{ color: '#E6EDF3', mb: 3 }}>Top Materials by Revenue</Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.topMaterials} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#7D8590', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${(v/100000).toFixed(1)}L`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                      {data.topMaterials.map((_, i) => <Cell key={i} fill={['#FF5722','#00BCD4','#00E676','#FFB300','#9C27B0'][i % 5]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {[
            { label: '👥 Manage Users', path: '/admin/users' },
            { label: '🏭 Manage Vendors', path: '/admin/vendors' },
            { label: '📦 All Orders', path: '/admin/orders' },
            { label: '🎫 Coupons', path: '/' },
          ].map(a => (
            <Grid item xs={6} md={3} key={a.label}>
              <Button fullWidth variant="outlined" onClick={() => navigate(a.path)}
                sx={{ py: 1.5, color: '#7D8590', borderColor: 'rgba(255,255,255,0.08)', '&:hover': { color: '#FF5722', borderColor: 'rgba(255,87,34,0.3)', background: 'rgba(255,87,34,0.05)' } }}>
                {a.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
