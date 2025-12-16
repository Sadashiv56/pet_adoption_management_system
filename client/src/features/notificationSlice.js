import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: { 
      reducer(state, action) { state.push(action.payload); },
      prepare(message, type = 'info') {
        return { payload: { id: nextId++, message, type } };
      }
    },
    removeNotification(state, action) {
      return state.filter(n => n.id !== action.payload);
    }
  }
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
