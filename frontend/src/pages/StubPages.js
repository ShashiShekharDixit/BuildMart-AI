/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Grid, Button, Stack, Chip, Rating, TextField, Alert, CircularProgress, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import api from '../services/api';

const PAGE_BG = { background: '#0D1117', minHeight: '100vh', pb: 6 };

const DEMO_PRODUCT = {
  name:'UltraTech OPC Cement 50kg', category:'CEMENT', currentPrice:380, unit:'bag',
  rating:4.5, totalRatings:128, brand:'UltraTech', stockQuantity:500, inStock:true,
  description:'Premium quality OPC 53 grade cement suitable for all types of construction. Meets IS 269:2015 standards.',
  vendor:{ businessName:'Sharma Traders', city:'Lucknow', rating:4.5, verificationStatus:'VERIFIED', deliveryRadiusKm:50 }
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/public/${id}`).then(r => setProduct(r.data)).catch(() => setProduct({ ...DEMO_PRODUCT, id })).finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    try { await api.post('/cart/add', { productId: id, quantity }); toast.success('Added to cart!'); }
    catch { toast.error('Please login to continue.'); navigate('/login'); }
  };

  if (loading) return <Box sx={{ ...PAGE_BG, display:'flex', alignItems:'center', justifyContent:'center' }}><CircularProgress sx={{ color:'#FF5722' }} /></Box>;
  if (!product) return <Box sx={PAGE_BG}><Container sx={{ py:8, textAlign:'center' }}><Typography sx={{ color:'#7D8590' }}>Product not found.</Typography></Container></Box>;

  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="lg" sx={{ pt:6 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Box sx={{ borderRadius:3, background:'radial-gradient(circle at 30% 40%, rgba(255,87,34,0.12), transparent 60%), #161B22', border:'1px solid rgba(255,255,255,0.08)', height:340, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8rem' }}>
              🏗️
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Chip label={product.category} size="small" sx={{ mb:2, background:'rgba(255,87,34,0.1)', color:'#FF8A65', border:'1px solid rgba(255,87,34,0.2)' }} />
            <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'1.8rem', color:'#E6EDF3', mb:1 }}>{product.name}</Typography>
            <Typography variant="body2" sx={{ color:'#7D8590', mb:2 }}>Brand: {product.brand}</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ '& .MuiRating-icon':{ color:'#FFB300' } }} />
              <Typography variant="body2" sx={{ color:'#7D8590' }}>({product.totalRatings} reviews)</Typography>
            </Stack>
            <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2.2rem', background:'linear-gradient(135deg, #FF5722, #FF8A65)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', mb:1 }}>
              ₹{Number(product.currentPrice).toLocaleString('en-IN')}
            </Typography>
            <Typography variant="body2" sx={{ color:'#7D8590', mb:2 }}>per {product.unit}</Typography>
            <Chip label={product.inStock ? `✓ In Stock (${product.stockQuantity} ${product.unit})` : '✗ Out of Stock'}
              sx={{ mb:3, background: product.inStock ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)', color: product.inStock ? '#00E676' : '#FF1744', border: `1px solid ${product.inStock ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}` }} />
            <Stack direction="row" spacing={2} mb={3}>
              <TextField label="Qty" type="number" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} inputProps={{ min:1 }} sx={{ width:100 }} size="small" />
              <Button variant="contained" size="large" startIcon={<ShoppingCartIcon />} onClick={addToCart} disabled={!product.inStock} sx={{ flex:1 }}>Add to Cart</Button>
            </Stack>
            <Box sx={{ p:2, borderRadius:2, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ fontSize:'1.8rem' }}>🏭</Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {product.vendor?.verificationStatus==='VERIFIED' && <VerifiedIcon sx={{ fontSize:14, color:'#00BCD4' }} />}
                    <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>{product.vendor?.businessName}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption" sx={{ color:'#7D8590' }}><LocationOnIcon sx={{ fontSize:12 }} />{product.vendor?.city}</Typography>
                    <Typography variant="caption" sx={{ color:'#7D8590' }}><LocalShippingIcon sx={{ fontSize:12 }} /> {product.vendor?.deliveryRadiusKm}km radius</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Typography sx={{ color:'#7D8590', mt:3, lineHeight:1.8 }}>{product.description}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items:[], total:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/cart').then(r => setCart(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const removeItem = async id => {
    await api.delete(`/cart/item/${id}`).catch(() => {});
    setCart(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  if (loading) return <Box sx={{ ...PAGE_BG, display:'flex', alignItems:'center', justifyContent:'center' }}><CircularProgress sx={{ color:'#FF5722' }} /></Box>;

  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="lg" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>🛒 My Cart</Typography>
        {cart.items.length === 0 ? (
          <Card sx={{ textAlign:'center', py:8 }}>
            <Typography sx={{ fontSize:'4rem', mb:2 }}>🛒</Typography>
            <Typography variant="h6" sx={{ color:'#E6EDF3', mb:2 }}>Your cart is empty</Typography>
            <Button variant="contained" onClick={() => navigate('/products')}>Browse Products</Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cart.items.map(item => (
                <Card key={item.id} sx={{ mb:2 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2}><Box sx={{ fontSize:'2.5rem' }}>📦</Box>
                        <Box>
                          <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>{item.product?.name}</Typography>
                          <Typography variant="body2" sx={{ color:'#7D8590' }}>Qty: {item.quantity} {item.product?.unit}</Typography>
                        </Box>
                      </Stack>
                      <Stack alignItems="flex-end">
                        <Typography sx={{ fontWeight:800, color:'#FF5722' }}>₹{(item.quantity*(item.product?.currentPrice||0)).toLocaleString('en-IN')}</Typography>
                        <Button size="small" sx={{ color:'#FF1744' }} onClick={() => removeItem(item.id)}>Remove</Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p:3 }}>
                  <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:2 }}>Order Summary</Typography>
                  <Stack spacing={1} mb={2}>
                    <Stack direction="row" justifyContent="space-between"><Typography sx={{ color:'#7D8590' }}>Subtotal</Typography><Typography sx={{ color:'#E6EDF3' }}>₹{(cart.total||0).toLocaleString('en-IN')}</Typography></Stack>
                    <Stack direction="row" justifyContent="space-between"><Typography sx={{ color:'#7D8590' }}>Delivery</Typography><Typography sx={{ color:'#00E676' }}>Free</Typography></Stack>
                  </Stack>
                  <Divider sx={{ mb:2 }} />
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>Total</Typography>
                    <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'1.3rem', color:'#FF5722' }}>₹{(cart.total||0).toLocaleString('en-IN')}</Typography>
                  </Stack>
                  <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')} sx={{ py:1.5 }}>Proceed to Checkout</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const SC = { PENDING:'warning', CONFIRMED:'info', DELIVERED:'success', CANCELLED:'error' };

  useEffect(() => { api.get('/orders').then(r => setOrders(r.data.orders||[])).catch(() => {}); }, []);

  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="lg" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>📦 My Orders</Typography>
        {orders.length === 0 ? (
          <Card sx={{ textAlign:'center', py:8 }}>
            <Typography sx={{ fontSize:'4rem', mb:2 }}>📦</Typography>
            <Typography variant="h6" sx={{ color:'#E6EDF3', mb:2 }}>No orders yet</Typography>
            <Button variant="contained" onClick={() => navigate('/products')}>Start Shopping</Button>
          </Card>
        ) : orders.map(o => (
          <Card key={o.orderNumber} sx={{ mb:2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={700} sx={{ color:'#FF5722' }}>{o.orderNumber}</Typography>
                  <Typography variant="caption" sx={{ color:'#7D8590' }}>{o.createdAt}</Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</Typography>
                  <Chip label={o.status} color={SC[o.status]||'default'} size="small" />
                  <Button size="small" variant="outlined" sx={{ color:'#7D8590', borderColor:'rgba(255,255,255,0.1)' }} onClick={() => navigate(`/orders/${o.orderNumber}/track`)}>Track</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
}

export function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const [tracking, setTracking] = useState(null);
  const STEPS = ['PENDING','CONFIRMED','PROCESSING','DISPATCHED','OUT_FOR_DELIVERY','DELIVERED'];

  useEffect(() => {
    api.get(`/orders/${orderNumber}/track`).then(r => setTracking(r.data)).catch(() =>
      setTracking({ status:'OUT_FOR_DELIVERY', driverName:'Ramesh Kumar', driverPhone:'+91-9876543210', estimatedArrival:'Today by 4:00 PM' })
    );
  }, [orderNumber]);

  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="md" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>📍 Track Order: {orderNumber}</Typography>
        {tracking && (
          <Card>
            <CardContent sx={{ p:4 }}>
              <Stack spacing={2.5}>
                {STEPS.map((step, i) => {
                  const done = i <= STEPS.indexOf(tracking.status);
                  return (
                    <Stack key={step} direction="row" spacing={2} alignItems="center">
                      <CheckCircleIcon sx={{ color: done ? '#00E676' : 'rgba(255,255,255,0.12)', fontSize:28, transition:'color 0.3s' }} />
                      <Box>
                        <Typography fontWeight={done ? 700 : 400} sx={{ color: done ? '#E6EDF3' : '#7D8590' }}>
                          {step.replace(/_/g,' ')}
                        </Typography>
                        {step === tracking.status && (
                          <Chip label="Current Status" size="small" sx={{ mt:0.5, background:'rgba(0,230,118,0.1)', color:'#00E676', fontSize:'0.65rem' }} />
                        )}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
              {tracking.driverName && (
                <Alert severity="info" sx={{ mt:3, background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>
                  <Typography fontWeight={700}>{tracking.driverName}</Typography>
                  <Typography variant="body2">📞 {tracking.driverPhone} · ETA: {tracking.estimatedArrival}</Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export function ProfilePage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'' });
  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="md" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>👤 My Profile</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p:3 }}>
                <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:3 }}>Personal Information</Typography>
                <Stack spacing={2}>
                  <TextField fullWidth label="First Name" value={form.firstName} onChange={e => setForm({...form,firstName:e.target.value})} />
                  <TextField fullWidth label="Last Name" value={form.lastName} onChange={e => setForm({...form,lastName:e.target.value})} />
                  <TextField fullWidth label="Phone" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                  <Button variant="contained" onClick={() => api.put('/user/profile',form).then(()=>toast.success('Updated!')).catch(()=>toast.error('Failed.'))}>Save Changes</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p:3 }}>
                <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:2 }}>Quick Links</Typography>
                {[{label:'📦 My Orders',path:'/orders'},{label:'❤️ Wishlist',path:'/wishlist'},{label:'🛒 Cart',path:'/cart'}].map(l => (
                  <Button key={l.label} fullWidth variant="outlined" sx={{ mb:1.5, justifyContent:'flex-start', color:'#7D8590', borderColor:'rgba(255,255,255,0.08)', '&:hover':{color:'#FF5722',borderColor:'rgba(255,87,34,0.3)'}  }}
                    onClick={() => window.location.href = l.path}>{l.label}</Button>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/wishlist').then(r => setItems(r.data||[])).catch(()=>{}); }, []);
  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="lg" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>❤️ My Wishlist</Typography>
        {items.length === 0 ? (
          <Card sx={{ textAlign:'center', py:8 }}>
            <Typography sx={{ fontSize:'4rem', mb:2 }}>❤️</Typography>
            <Typography variant="h6" sx={{ color:'#E6EDF3', mb:2 }}>Wishlist is empty</Typography>
            <Button variant="contained" onClick={() => navigate('/products')}>Explore Products</Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {items.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>{item.product?.name}</Typography>
                    <Typography sx={{ color:'#FF5722', fontWeight:800, mt:1 }}>₹{item.product?.currentPrice}</Typography>
                    <Button fullWidth variant="outlined" sx={{ mt:2, color:'#7D8590', borderColor:'rgba(255,255,255,0.1)' }}>Add to Cart</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullAddress:'', city:'', pincode:'' });
  const [payment, setPayment] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await api.post('/orders/place', { addressId:1, paymentMethod:payment });
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${res.data.orderNumber}/track`);
    } catch { toast.error('Failed to place order.'); }
    finally { setPlacing(false); }
  };

  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="md" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:4 }}>Checkout</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb:3 }}>
              <CardContent sx={{ p:3 }}>
                <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:2 }}>📍 Delivery Address</Typography>
                <Stack spacing={2}>
                  <TextField fullWidth label="Full Address" multiline rows={2} value={address.fullAddress} onChange={e => setAddress({...address,fullAddress:e.target.value})} />
                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="City" value={address.city} onChange={e => setAddress({...address,city:e.target.value})} />
                    <TextField fullWidth label="Pincode" value={address.pincode} onChange={e => setAddress({...address,pincode:e.target.value})} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ p:3 }}>
                <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:2 }}>💳 Payment Method</Typography>
                <Stack spacing={1.5}>
                  {[{value:'COD',label:'Cash on Delivery'},{value:'UPI',label:'UPI / GPay / PhonePe'},{value:'BANK_TRANSFER',label:'Bank Transfer / NEFT'}].map(p => (
                    <Box key={p.value} onClick={() => setPayment(p.value)} sx={{
                      p:2, borderRadius:2, cursor:'pointer', border:'1px solid',
                      borderColor: payment===p.value ? 'rgba(255,87,34,0.5)' : 'rgba(255,255,255,0.08)',
                      background: payment===p.value ? 'rgba(255,87,34,0.08)' : 'rgba(255,255,255,0.02)',
                    }}>
                      <Typography fontWeight={payment===p.value ? 700 : 400} sx={{ color: payment===p.value ? '#FF8A65' : '#7D8590' }}>{p.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ position:'sticky', top:80 }}>
              <CardContent sx={{ p:3 }}>
                <Typography fontWeight={700} sx={{ color:'#E6EDF3', mb:2 }}>Order Summary</Typography>
                <Divider sx={{ mb:2 }} />
                <Button fullWidth variant="contained" size="large" onClick={placeOrder} disabled={placing}
                  startIcon={placing && <CircularProgress size={18} color="inherit" />}
                  sx={{ py:1.5, mb:1 }}>
                  {placing ? 'Placing Order...' : 'Place Order'}
                </Button>
                <Typography variant="caption" sx={{ color:'#7D8590', display:'block', textAlign:'center' }}>
                  Secure checkout · GST invoice included
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// Vendor stubs
export function VendorProductsPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>My Products</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Connect backend to manage products. API: <strong>GET /api/products/vendor/my-products</strong></Alert></Container></Box>;
}
export function VendorOrdersPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>Incoming Orders</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Connect backend at <strong>GET /api/orders/vendor/incoming</strong></Alert></Container></Box>;
}
export function VendorAnalyticsPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>Analytics</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Full analytics via <strong>GET /api/vendor/analytics</strong></Alert></Container></Box>;
}
export function VendorRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessName:'', gstNumber:'', businessAddress:'', city:'', deliveryRadiusKm:25 });
  return (
    <Box sx={PAGE_BG}>
      <Container maxWidth="sm" sx={{ pt:6 }}>
        <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:1 }}>Register as Vendor</Typography>
        <Typography sx={{ color:'#7D8590', mb:4 }}>Start selling on BuildMart AI</Typography>
        <Card>
          <CardContent sx={{ p:3 }}>
            <Stack spacing={2}>
              <TextField fullWidth label="Business Name" required value={form.businessName} onChange={e => setForm({...form,businessName:e.target.value})} />
              <TextField fullWidth label="GST Number" value={form.gstNumber} onChange={e => setForm({...form,gstNumber:e.target.value})} />
              <TextField fullWidth label="Business Address" multiline rows={2} value={form.businessAddress} onChange={e => setForm({...form,businessAddress:e.target.value})} />
              <TextField fullWidth label="City" value={form.city} onChange={e => setForm({...form,city:e.target.value})} />
              <TextField fullWidth label="Delivery Radius (km)" type="number" value={form.deliveryRadiusKm} onChange={e => setForm({...form,deliveryRadiusKm:Number(e.target.value)})} />
              <Button variant="contained" fullWidth size="large" sx={{ py:1.5 }}
                onClick={() => api.put('/vendor/profile',form).then(()=>{toast.success('Submitted!'); navigate('/vendor/dashboard');}).catch(()=>{toast.error('Please login as vendor first.'); navigate('/login');})}>
                Submit for Verification
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// Admin stubs
export function AdminVendorsPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>Vendor Management</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Full management via <strong>GET /api/admin/vendors</strong>. Use Admin Dashboard for approvals.</Alert></Container></Box>;
}
export function AdminUsersPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>User Management</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Full management via <strong>GET /api/admin/users</strong></Alert></Container></Box>;
}
export function AdminOrdersPage() {
  return <Box sx={PAGE_BG}><Container sx={{ pt:6 }}><Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3', mb:3 }}>All Orders</Typography><Alert severity="info" sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', color:'#00BCD4' }}>Full management via <strong>GET /api/admin/orders</strong></Alert></Container></Box>;
}
