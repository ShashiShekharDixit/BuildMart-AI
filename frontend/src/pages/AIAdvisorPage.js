/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Chip, Stack, Alert, FormControl, InputLabel, Select, MenuItem, LinearProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ICONS = { 'Cement':'🏗️','Bricks':'🧱','Sand':'⛱️','Iron Rods':'🔩','Aggregate':'🪨','Tiles':'🪟','Steel':'🔩' };
const REGIONS = ['Delhi NCR','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Lucknow','Kanpur','Jaipur','Pune','Ahmedabad'];
const MATERIALS = ['Cement','Bricks','Sand','Iron Rods','Aggregate','Tiles','Marble','Pipes','Paint','Hardware'];

export default function AIAdvisorPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('advisor');
  const [aIn, setAIn] = useState({ description:'', areaSqFt:'', floors:1, constructionType:'residential' });
  const [aResult, setAResult] = useState(null);
  const [aLoading, setALoading] = useState(false);
  const [aError, setAError] = useState('');
  const [pIn, setPIn] = useState({ material:'Cement', region:'Lucknow', targetMonth:'Next Month' });
  const [pResult, setPResult] = useState(null);
  const [pLoading, setPLoading] = useState(false);

  const calcFallback = () => {
    const area = Number(aIn.areaSqFt) || 1000;
    const floors = Number(aIn.floors) || 1;
    const t = area * floors;
    return {
      projectSummary:`Formula-based estimate for ${t.toLocaleString()} sq ft`,
      totalArea: t, areaUnit:'sq ft',
      materials:[
        { name:'Cement', quantity:Math.round(t*0.4), unit:'bags (50kg)', estimatedCost:Math.round(t*0.4*380) },
        { name:'Bricks', quantity:Math.round(t*9), unit:'pieces', estimatedCost:Math.round(t*9*8) },
        { name:'Sand', quantity:Math.round(t*0.6), unit:'cubic meters', estimatedCost:Math.round(t*0.6*1200) },
        { name:'Iron Rods', quantity:Math.round(t*4.5), unit:'kg', estimatedCost:Math.round(t*4.5*65) },
        { name:'Aggregate', quantity:Math.round(t*0.8), unit:'cubic meters', estimatedCost:Math.round(t*0.8*900) },
      ],
      totalEstimatedCost: Math.round(t*(0.4*380+9*8+0.6*1200+4.5*65+0.8*900)),
      disclaimer:'±15% variation expected based on design quality.',
      tips:['Add 10% extra for wastage','Compare prices from multiple vendors','Consult a local civil engineer'],
    };
  };

  const handleAdvisor = async () => {
    if (!aIn.description.trim()) { setAError('Please describe your project.'); return; }
    setALoading(true); setAError(''); setAResult(null);
    try {
      const res = await api.post('/ai/material-advisor', aIn);
      setAResult(res.data);
    } catch {
      setAError('AI unavailable — showing formula-based estimate.');
      setAResult(calcFallback());
    } finally { setALoading(false); }
  };

  const handlePredict = async () => {
    setPLoading(true); setPResult(null);
    try {
      const res = await api.post('/ai/price-prediction', pIn);
      setPResult(res.data);
    } catch {
      setPResult({ material:pIn.material, prediction:'STABLE', predictedChangePercent:2.5, confidence:'MEDIUM', recommendation:'Market appears stable. Good time to order.', factors:['Stable fuel prices','Normal seasonal demand'] });
    } finally { setPLoading(false); }
  };

  const glowColor = p => p==='INCREASE' ? '#FF1744' : p==='DECREASE' ? '#00E676' : '#FFB300';

  return (
    <Box sx={{ background:'#0D1117', minHeight:'100vh', pb:8 }}>
      {/* Header */}
      <Box sx={{ background:'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, rgba(13,17,23,0) 60%)', borderBottom:'1px solid rgba(255,255,255,0.06)', py:6 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box sx={{ width:52, height:52, borderRadius:'14px', background:'linear-gradient(135deg, #00BCD4, #0097A7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', boxShadow:'0 8px 24px rgba(0,188,212,0.3)' }}>🤖</Box>
            <Box>
              <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#E6EDF3' }}>BuildMart AI Advisor</Typography>
              <Typography variant="body2" sx={{ color:'#7D8590' }}>Powered by GPT-4 · Trained on Indian construction data</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            {[{key:'advisor',label:'📐 Material Estimator'},{key:'price',label:'📈 Price Predictor'}].map(t => (
              <Button key={t.key} onClick={() => setTab(t.key)}
                sx={{
                  px:3, py:1, borderRadius:2, fontWeight:600,
                  background: tab===t.key ? 'rgba(0,188,212,0.15)' : 'transparent',
                  color: tab===t.key ? '#00BCD4' : '#7D8590',
                  border: `1px solid ${tab===t.key ? 'rgba(0,188,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  '&:hover': { background:'rgba(0,188,212,0.1)', color:'#00BCD4' },
                }}>{t.label}</Button>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt:5 }}>
        {tab==='advisor' && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent sx={{ p:4 }}>
                  <Typography fontWeight={700} sx={{ color:'#E6EDF3', fontSize:'1.2rem', mb:3 }}>🏗️ Describe Your Project</Typography>
                  <TextField fullWidth multiline rows={3} label="Project Description"
                    placeholder='"2-floor house, 1500 sq ft per floor in Lucknow"'
                    value={aIn.description} onChange={e => setAIn({...aIn,description:e.target.value})} sx={{ mb:3 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Area (sq ft)" type="number" value={aIn.areaSqFt} onChange={e => setAIn({...aIn,areaSqFt:e.target.value})} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Floors" type="number" inputProps={{min:1,max:20}} value={aIn.floors} onChange={e => setAIn({...aIn,floors:Number(e.target.value)})} />
                    </Grid>
                  </Grid>
                  <FormControl fullWidth sx={{ mt:2 }}>
                    <InputLabel>Construction Type</InputLabel>
                    <Select value={aIn.constructionType} label="Construction Type" onChange={e => setAIn({...aIn,constructionType:e.target.value})}>
                      <MenuItem value="residential">Residential (House/Flat)</MenuItem>
                      <MenuItem value="commercial">Commercial (Shop/Office)</MenuItem>
                      <MenuItem value="renovation">Renovation / Repair</MenuItem>
                    </Select>
                  </FormControl>
                  {aError && <Alert severity="warning" sx={{ mt:2, background:'rgba(255,179,0,0.08)', border:'1px solid rgba(255,179,0,0.2)', color:'#FFB300' }}>{aError}</Alert>}
                  <Button fullWidth variant="contained" size="large" onClick={handleAdvisor} disabled={aLoading}
                    startIcon={aLoading ? <CircularProgress size={18} color="inherit" /> : <CalculateIcon />}
                    sx={{ mt:3, py:1.5 }}>
                    {aLoading ? 'Calculating...' : 'Calculate Materials'}
                  </Button>
                  <Typography variant="caption" sx={{ color:'#7D8590', display:'block', textAlign:'center', mt:1.5 }}>
                    ⚡ AI-powered · Formula fallback · Works offline
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              {aLoading && (
                <Card>
                  <CardContent sx={{ p:4, textAlign:'center' }}>
                    <CircularProgress size={48} sx={{ color:'#00BCD4', mb:2 }} />
                    <Typography sx={{ color:'#E6EDF3', fontWeight:600 }}>AI is calculating materials...</Typography>
                    <Typography variant="body2" sx={{ color:'#7D8590', mb:3 }}>Analyzing project requirements</Typography>
                    <LinearProgress sx={{ borderRadius:2, '& .MuiLinearProgress-bar':{ background:'linear-gradient(90deg, #00BCD4, #0097A7)' }, background:'rgba(0,188,212,0.1)' }} />
                  </CardContent>
                </Card>
              )}
              {aResult && !aLoading && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
                  <Card>
                    <CardContent sx={{ p:4 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box>
                          <Typography fontWeight={700} sx={{ color:'#E6EDF3', fontSize:'1.2rem' }}>Material Estimate</Typography>
                          <Typography variant="body2" sx={{ color:'#7D8590' }}>{aResult.projectSummary}</Typography>
                        </Box>
                        <Chip label={`${aResult.totalArea} ${aResult.areaUnit}`}
                          sx={{ background:'rgba(0,188,212,0.1)', color:'#00BCD4', border:'1px solid rgba(0,188,212,0.3)' }} />
                      </Stack>
                      <Grid container spacing={2} mb={3}>
                        {(aResult.materials||[]).map((mat,i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Box sx={{ p:2, borderRadius:2, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', '&:hover':{ border:'1px solid rgba(0,188,212,0.3)', background:'rgba(0,188,212,0.05)' }, transition:'all 0.2s' }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Typography sx={{ fontSize:'1.3rem' }}>{ICONS[mat.name]||'📦'}</Typography>
                                <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>{mat.name}</Typography>
                              </Stack>
                              <Typography sx={{ fontWeight:800, fontSize:'1.1rem', color:'#00BCD4' }}>
                                {typeof mat.quantity==='number' ? mat.quantity.toLocaleString('en-IN') : mat.quantity}
                                <Typography component="span" variant="caption" sx={{ color:'#7D8590' }}> {mat.unit}</Typography>
                              </Typography>
                              {mat.estimatedCost && (
                                <Typography variant="body2" sx={{ color:'#00E676', fontWeight:600 }}>≈ ₹{Number(mat.estimatedCost).toLocaleString('en-IN')}</Typography>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      {aResult.totalEstimatedCost && (
                        <Box sx={{ background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', borderRadius:2, p:2, mb:3 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={700} sx={{ color:'#E6EDF3' }}>Total Estimated Cost</Typography>
                            <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'1.3rem', color:'#00BCD4' }}>
                              ₹{Number(aResult.totalEstimatedCost).toLocaleString('en-IN')}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color:'#7D8590' }}>{aResult.disclaimer}</Typography>
                        </Box>
                      )}
                      {aResult.tips && (
                        <Box mb={3}>
                          <Typography fontWeight={600} sx={{ color:'#E6EDF3', mb:1 }}>💡 Tips</Typography>
                          {aResult.tips.map((t,i) => <Typography key={i} variant="body2" sx={{ color:'#7D8590', mb:0.5 }}>• {t}</Typography>)}
                        </Box>
                      )}
                      <Button fullWidth variant="contained" size="large" startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/products')} sx={{ py:1.5 }}>
                        Shop These Materials on BuildMart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {!aResult && !aLoading && (
                <Box sx={{ textAlign:'center', py:12, color:'#7D8590' }}>
                  <Typography sx={{ fontSize:'5rem', mb:2 }}>🏗️</Typography>
                  <Typography variant="h6" sx={{ color:'#E6EDF3' }}>Describe your project on the left</Typography>
                  <Typography>AI will estimate all materials + costs instantly</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        )}

        {tab==='price' && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p:4 }}>
                  <Typography fontWeight={700} sx={{ color:'#E6EDF3', fontSize:'1.2rem', mb:3 }}>📈 Price Prediction</Typography>
                  <FormControl fullWidth sx={{ mb:2 }}>
                    <InputLabel>Material</InputLabel>
                    <Select value={pIn.material} label="Material" onChange={e => setPIn({...pIn,material:e.target.value})}>
                      {MATERIALS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb:3 }}>
                    <InputLabel>Region</InputLabel>
                    <Select value={pIn.region} label="Region" onChange={e => setPIn({...pIn,region:e.target.value})}>
                      {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button fullWidth variant="contained" size="large" onClick={handlePredict} disabled={pLoading}
                    startIcon={pLoading ? <CircularProgress size={18} color="inherit" /> : <TrendingUpIcon />}
                    sx={{ py:1.5, background:'linear-gradient(135deg, #00BCD4, #0097A7)', '&:hover':{ background:'linear-gradient(135deg, #0097A7, #00838F)' } }}>
                    {pLoading ? 'Predicting...' : 'Predict Price'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              {pLoading && (
                <Card><CardContent sx={{ p:4, textAlign:'center' }}>
                  <CircularProgress size={48} sx={{ color:'#00BCD4', mb:2 }} />
                  <Typography sx={{ color:'#E6EDF3' }}>Analyzing market data & seasonal trends...</Typography>
                </CardContent></Card>
              )}
              {pResult && !pLoading && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
                  <Card>
                    <CardContent sx={{ p:4 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography fontWeight={700} sx={{ color:'#E6EDF3', fontSize:'1.2rem' }}>{pResult.material} — Price Outlook</Typography>
                        <Chip label={pResult.prediction==='INCREASE' ? '📈 Will Rise' : pResult.prediction==='DECREASE' ? '📉 Will Fall' : '➡️ Stable'}
                          sx={{ background:`${glowColor(pResult.prediction)}15`, color:glowColor(pResult.prediction), border:`1px solid ${glowColor(pResult.prediction)}30`, fontWeight:700 }} />
                      </Stack>
                      {pResult.predictedChangePercent && (
                        <Stack direction="row" spacing={2} mb={3}>
                          <Box sx={{ flex:1, textAlign:'center', p:2, background:`${glowColor(pResult.prediction)}08`, border:`1px solid ${glowColor(pResult.prediction)}20`, borderRadius:2 }}>
                            <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:glowColor(pResult.prediction) }}>
                              {pResult.prediction==='INCREASE' ? '+' : ''}{pResult.predictedChangePercent}%
                            </Typography>
                            <Typography variant="body2" sx={{ color:'#7D8590' }}>Predicted change</Typography>
                          </Box>
                          <Box sx={{ flex:1, textAlign:'center', p:2, background:'rgba(0,188,212,0.08)', border:'1px solid rgba(0,188,212,0.2)', borderRadius:2 }}>
                            <Typography sx={{ fontFamily:'"Space Grotesk"', fontWeight:800, fontSize:'2rem', color:'#00BCD4' }}>{pResult.confidence}</Typography>
                            <Typography variant="body2" sx={{ color:'#7D8590' }}>Confidence</Typography>
                          </Box>
                        </Stack>
                      )}
                      {pResult.factors && (
                        <Box mb={3}>
                          <Typography fontWeight={600} sx={{ color:'#E6EDF3', mb:1 }}>Key Factors</Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {pResult.factors.map((f,i) => (
                              <Chip key={i} label={f} size="small"
                                sx={{ background:'rgba(255,255,255,0.04)', color:'#7D8590', border:'1px solid rgba(255,255,255,0.08)' }} />
                            ))}
                          </Stack>
                        </Box>
                      )}
                      {pResult.recommendation && (
                        <Box sx={{ p:2, background:pResult.prediction==='INCREASE' ? 'rgba(255,179,0,0.08)' : 'rgba(0,230,118,0.08)', border:`1px solid ${pResult.prediction==='INCREASE' ? 'rgba(255,179,0,0.2)' : 'rgba(0,230,118,0.2)'}`, borderRadius:2 }}>
                          <Typography fontWeight={600} sx={{ color:pResult.prediction==='INCREASE' ? '#FFB300' : '#00E676' }}>💡 {pResult.recommendation}</Typography>
                        </Box>
                      )}
                      <Button variant="outlined" sx={{ mt:3, color:'#7D8590', borderColor:'rgba(255,255,255,0.1)', '&:hover':{ color:'#FF5722', borderColor:'rgba(255,87,34,0.3)' } }}
                        onClick={() => navigate('/products')}>
                        Buy {pIn.material} Now →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {!pResult && !pLoading && (
                <Box sx={{ textAlign:'center', py:12 }}>
                  <Typography sx={{ fontSize:'5rem', mb:2 }}>📊</Typography>
                  <Typography variant="h6" sx={{ color:'#E6EDF3' }}>Select material & region</Typography>
                  <Typography sx={{ color:'#7D8590' }}>AI predicts price trends for the next 30 days</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
