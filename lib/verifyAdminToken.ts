import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

export function verifyAdminToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    return decoded.role === "admin" ? decoded : null;
  } catch {
    return null;
  }
}
