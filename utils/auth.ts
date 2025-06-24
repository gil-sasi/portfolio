import jwt from "jsonwebtoken";

interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  exp?: number; // JWT expiration timestamp
}

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
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
 * Get user from token if valid and not expired
 */
export const getInitialUser = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log("⏰ Token expired, cleaning up localStorage");
      localStorage.removeItem("token");
      return null;
    }

    const decoded = jwt.decode(token) as DecodedToken;
    if (decoded?.firstName && decoded?.lastName) {
      return decoded;
    }
  } catch {
    localStorage.removeItem("token");
  }

  return null;
};

/**
 * Get valid token (removes expired tokens automatically)
 */
export const getValidToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    console.log("⏰ Token expired, cleaning up localStorage");
    localStorage.removeItem("token");
    return null;
  }

  return token;
};
