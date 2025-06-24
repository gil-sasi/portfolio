import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";

//  Define the shape of decoded JWT payload
export interface DecodedToken {
  id?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  profilePicture?: string | null;
  exp?: number; // JWT expiration timestamp
}

//  Define the shape of your auth state in Redux
interface AuthState {
  user: DecodedToken | null;
}

//  Initial state of auth (no user logged in yet)
const initialState: AuthState = {
  user: null,
};

//  Create the Redux slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //  Set user info in Redux state (after login)
    login: (state, action: PayloadAction<DecodedToken>) => {
      state.user = action.payload;
    },

    //  Clear user info and remove token from localStorage (on logout)
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // 🔁 Clears token when user logs out
      }
    },
  },
});

//  Export actions for use in your app
export const { login, logout } = authSlice.actions;

/**
 * Check if a JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as DecodedToken;
    if (!decoded?.exp) return true;

    // JWT exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true; // If we can't decode it, consider it expired
  }
};

/**
 *  Auto-login from token if localStorage contains it.
 * Called when app loads to restore user from existing token.
 */
export const setUserFromToken = () => async (dispatch: any) => {
  if (typeof window === "undefined") return; // Skip on server

  const token = localStorage.getItem("token"); //  Use localStorage for consistency
  console.log("🧠 setUserFromToken running");
  console.log("📦 Token from storage:", token);

  if (token) {
    try {
      // 🕐 Check if token is expired
      if (isTokenExpired(token)) {
        console.log("⏰ Token is expired, removing from storage");
        localStorage.removeItem("token");
        return;
      }

      //  This does NOT verify the signature — only decodes the token locally
      const decoded = jwt.decode(token) as DecodedToken;
      console.log("✅ Decoded token:", decoded);

      //  If token includes necessary user fields, dispatch login
      if (decoded?.firstName && decoded?.lastName) {
        dispatch(login(decoded));
      }
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      localStorage.removeItem("token"); // 🧹 Clean up bad token
    }
  }
};

//  Export the reducer for use in Redux store
export default authSlice.reducer;
