import { configureStore, createSlice } from '@reduxjs/toolkit';

// Temporary placeholder slice - replace with actual slices as needed
const appSlice = createSlice({
  name: 'app',
  initialState: {
    initialized: true,
  },
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;