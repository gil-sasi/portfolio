import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";
import { AppDispatch } from "../store";

export interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: DecodedToken | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<DecodedToken>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export const setUserFromToken = () => (dispatch: AppDispatch) => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  console.log("🧠 setUserFromToken running");
  console.log("📦 Token from storage:", token);

  if (token) {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      console.log("✅ Decoded token:", decoded);

      if (decoded?.firstName && decoded?.lastName) {
        dispatch(login(decoded));
      }
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      localStorage.removeItem("token");
    }
  }
};

export default authSlice.reducer;
