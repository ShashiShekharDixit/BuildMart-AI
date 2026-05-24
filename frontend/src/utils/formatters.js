/**
 * BuildMart — Utility Formatters
 */

// Format currency in Indian format
export const formatINR = (amount, compact = false) => {
  if (amount === null || amount === undefined) return '₹0';
  const num = Number(amount);
  if (compact) {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000)   return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000)     return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Format quantity with unit
export const formatQty = (qty, unit) => {
  if (!qty) return `0 ${unit || ''}`;
  return `${Number(qty).toLocaleString('en-IN')} ${unit || ''}`;
};

// Format date to Indian locale
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Format date-time
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Truncate text
export const truncate = (text, max = 80) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || '?';
};

// Status to color mapping
export const getStatusColor = (status) => {
  const map = {
    PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
    DISPATCHED: 'primary', OUT_FOR_DELIVERY: 'primary',
    DELIVERED: 'success', CANCELLED: 'error', RETURNED: 'error',
    VERIFIED: 'success', REJECTED: 'error', SUSPENDED: 'error',
    PAID: 'success', FAILED: 'error', REFUNDED: 'warning',
  };
  return map[status] || 'default';
};

// Category to emoji
export const getCategoryIcon = (category) => {
  const map = {
    CEMENT: '🏗️', BRICKS: '🧱', SAND: '⛱️', IRON_RODS: '🔩',
    TILES: '🪟', MARBLE: '💎', PIPES: '🔧', AGGREGATE: '🪨',
    PAINT: '🎨', HARDWARE: '🔨', OTHER: '📦',
  };
  return map[category] || '📦';
};

// Validate Indian phone number
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// Validate GST number
export const isValidGST = (gst) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);

// Generate order display number
export const formatOrderNumber = (num) => `BM-${num}`;
