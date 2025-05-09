import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// ✅ No need to manually add thunk
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Optional: leave this out completely if you're not adding other middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // or just omit it
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
