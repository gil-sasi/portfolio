import jwt from "jsonwebtoken";

interface DecodedToken {
  firstName: string;
  lastName: string;
  role: string;
}

export const getInitialUser = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (decoded?.firstName && decoded?.lastName) return decoded;
    } catch {
      localStorage.removeItem("token");
    }
  }
  return null;
};
