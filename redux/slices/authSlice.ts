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

    //  Clear user info and remove token from sessionStorage (on logout)
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token"); // 🔁 Clears token when user logs out
      }
    },
  },
});

//  Export actions for use in your app
export const { login, logout } = authSlice.actions;

/**
 *  Auto-login from token if sessionStorage contains it.
 * Called when app loads to restore user from existing token.
 */
export const setUserFromToken = () => async (dispatch: any) => {
  if (typeof window === "undefined") return; // Skip on server

  const token = sessionStorage.getItem("token"); //  Use sessionStorage instead of localStorage
  console.log("🧠 setUserFromToken running");
  console.log("📦 Token from storage:", token);

  if (token) {
    try {
      //  This does NOT verify the signature — only decodes the token locally
      const decoded = jwt.decode(token) as DecodedToken;
      console.log("✅ Decoded token:", decoded);

      //  If token includes necessary user fields, dispatch login
      if (decoded?.firstName && decoded?.lastName) {
        dispatch(login(decoded));
      }
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      sessionStorage.removeItem("token"); // 🧹 Clean up bad token
    }
  }
};

//  Export the reducer for use in Redux store
export default authSlice.reducer;
