/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, Fab, Stack, Chip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const QUICK = ['How much cement for 1000 sq ft?', 'Compare brick types', 'What is M25 cement?', 'Delivery time?'];
const INTRO = `Hi! I'm **BuildMart AI** 🤖\n\nI can help you:\n• Estimate materials for your project\n• Find the right products\n• Explain quality grades\n• Answer delivery questions\n\nWhat are you building?`;

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: INTRO, id: 1 }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg, id: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', { message: msg, history: history.slice(0, -1) });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply, id: Date.now() + 1 }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try browsing our products!", id: Date.now() + 1 }]);
    } finally { setLoading(false); }
  };

  const renderMsg = content =>
    content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map((line, i) => (
      <div key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
    ));

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1300 }}>
        <AnimatePresence>
          {!open && (
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Fab onClick={() => setOpen(true)} sx={{
                width: 60, height: 60,
                background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
                boxShadow: '0 8px 24px rgba(255,87,34,0.5)',
                '&:hover': { background: 'linear-gradient(135deg, #E64A19, #FF5722)', transform: 'scale(1.05)' },
              }}>
                <Box sx={{ position: 'relative' }}>
                  <SmartToyIcon sx={{ color: 'white' }} />
                  {unread > 0 && (
                    <Box sx={{ position: 'absolute', top: -8, right: -8, width: 18, height: 18, borderRadius: '50%', background: '#FF1744', color: 'white', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread}</Box>
                  )}
                </Box>
              </Fab>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1300 }}>
            <Paper elevation={24} sx={{
              width: { xs: 'calc(100vw - 32px)', sm: 380 }, height: 520,
              display: 'flex', flexDirection: 'column',
              background: '#161B22', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              {/* Header */}
              <Box sx={{ background: 'linear-gradient(135deg, #FF5722, #E64A19)', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)' }}>
                  <SmartToyIcon sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Box flex={1}>
                  <Typography fontWeight={700} sx={{ color: 'white' }}>BuildMart AI</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#00E676', animation: 'neon-pulse 2s infinite' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Online · GPT-4</Typography>
                  </Stack>
                </Box>
                <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: 'white', '&:hover': { background: 'rgba(255,255,255,0.15)' } }}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2, background: '#0D1117' }}>
                {messages.map(msg => (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                    {msg.role === 'assistant' && (
                      <Avatar sx={{ width: 26, height: 26, mr: 1, mt: 0.5, flexShrink: 0, background: '#FF5722' }}>
                        <AutoAwesomeIcon sx={{ fontSize: 13 }} />
                      </Avatar>
                    )}
                    <Box sx={{
                      maxWidth: '80%', px: 2, py: 1.2,
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #FF5722, #FF8A65)' : 'rgba(255,255,255,0.06)',
                      color: msg.role === 'user' ? 'white' : '#E6EDF3',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      fontSize: '0.875rem', lineHeight: 1.6,
                    }}>
                      {renderMsg(msg.content)}
                    </Box>
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Avatar sx={{ width: 26, height: 26, flexShrink: 0, background: '#FF5722' }}>
                      <AutoAwesomeIcon sx={{ fontSize: 13 }} />
                    </Avatar>
                    <Box sx={{ px: 2, py: 1.2, background: 'rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5722' }} />
                          </motion.div>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                )}
                <div ref={endRef} />
              </Box>

              {/* Quick questions */}
              {messages.length <= 2 && (
                <Box sx={{ px: 2, pb: 1, background: '#0D1117' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {QUICK.map(q => (
                      <Chip key={q} label={q} size="small" onClick={() => sendMessage(q)}
                        sx={{ cursor: 'pointer', fontSize: '0.68rem', background: 'rgba(255,87,34,0.1)', color: '#FF8A65', border: '1px solid rgba(255,87,34,0.2)', '&:hover': { background: 'rgba(255,87,34,0.2)' } }} />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Input */}
              <Box sx={{ p: 1.5, background: '#161B22', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField fullWidth multiline maxRows={3} placeholder="Ask anything about construction..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.04)', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' } } }} />
                <IconButton onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  sx={{ background: 'linear-gradient(135deg, #FF5722, #FF8A65)', color: 'white', borderRadius: 2, '&:hover': { background: 'linear-gradient(135deg, #E64A19, #FF5722)' }, '&:disabled': { background: 'rgba(255,255,255,0.08)', color: '#7D8590' }, flexShrink: 0 }}>
                  <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
