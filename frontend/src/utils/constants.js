export const APP_NAME = process.env.REACT_APP_APP_NAME || 'BuildMart AI';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';
export const IS_DEV = process.env.REACT_APP_ENV === 'development';
export const IS_PROD = process.env.REACT_APP_ENV === 'production';

export const ROLES = { CUSTOMER: 'CUSTOMER', VENDOR: 'VENDOR', ADMIN: 'ADMIN' };

export const ORDER_STATUS = {
  PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', PROCESSING: 'PROCESSING',
  DISPATCHED: 'DISPATCHED', OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED', CANCELLED: 'CANCELLED', RETURNED: 'RETURNED',
};

export const CATEGORIES = [
  { id: 'CEMENT', label: 'Cement', icon: '🏗️' },
  { id: 'BRICKS', label: 'Bricks', icon: '🧱' },
  { id: 'SAND', label: 'Sand', icon: '⛱️' },
  { id: 'IRON_RODS', label: 'Iron Rods', icon: '🔩' },
  { id: 'TILES', label: 'Tiles', icon: '🪟' },
  { id: 'MARBLE', label: 'Marble', icon: '💎' },
  { id: 'PIPES', label: 'Pipes', icon: '🔧' },
  { id: 'AGGREGATE', label: 'Aggregate', icon: '🪨' },
  { id: 'PAINT', label: 'Paint', icon: '🎨' },
  { id: 'HARDWARE', label: 'Hardware', icon: '🔨' },
];

export const INDIAN_CITIES = [
  'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Delhi', 'Noida',
  'Gurgaon', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Jaipur', 'Ahmedabad', 'Surat', 'Bhopal', 'Indore', 'Nagpur',
];

export const TOAST_CONFIG = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'colored',
};
