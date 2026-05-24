// Notification slice
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllRead: (state) => { state.unreadCount = 0; },
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
  },
});

export const { addNotification, markAllRead, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
