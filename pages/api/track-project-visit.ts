import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import axios from "axios";

const projectVisitorSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  projectName: { type: String, required: true },
  ip: { type: String, required: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
  userAgent: { type: String, default: "" },
  referrer: { type: String, default: "" },
  isValidVisitor: { type: Boolean, default: true },
});

// Add indexes after schema creation
projectVisitorSchema.index({ projectId: 1, ip: 1 });
projectVisitorSchema.index({ projectId: 1, lastVisit: -1 });
projectVisitorSchema.index({ lastVisit: -1 });

const ProjectVisitor =
  mongoose.models.ProjectVisitor ||
  mongoose.model("ProjectVisitor", projectVisitorSchema);

// Enhanced bot detection patterns (same as main visitor tracking)
const BOT_PATTERNS = [
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit/i,
  /twitterbot|linkedinbot|whatsapp|telegram|discord|slack/i,
  /curl|wget|postman|insomnia|httpie|axios|fetch|node|python|ruby|go-http|java|php/i,
  /vercel|netlify|github|gitlab|travis|jenkins|circleci|heroku|aws/i,
  /nmap|nikto|sqlmap|burpsuite|owasp|security|scanner/i,
  /bot|crawl|spider|scraper|checker|monitor|uptime|health|preview|meta|validator/i,
  /headless|phantom|selenium|playwright|puppeteer/i,
];

// const DEVELOPMENT_IPS = ["127.0.0.1", "::1", "localhost"];

const SUSPICIOUS_REFERRERS = [
  /vercel\.app/i,
  /netlify\.app/i,
  /herokuapp\.com/i,
  /ngrok\.io/i,
  /localhost/i,
  /127\.0\.0\.1/i,
  /192\.168\./i,
  /10\.\d+\./i,
];

function isBot(ua: string): boolean {
  if (!ua || ua.length < 10) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(ua));
}

function isDevelopmentIP(ip: string): boolean {
  // TEMPORARILY DISABLED FOR TESTING - normally we filter out development IPs
  return false;

  // return (
  //   DEVELOPMENT_IPS.includes(ip) ||
  //   ip.startsWith("192.168.") ||
  //   ip.startsWith("10.") ||
  //   ip.startsWith("172.16.") ||
  //   ip === "unknown"
  // );
}

function isSuspiciousReferrer(referrer: string): boolean {
  if (!referrer) return false;
  return SUSPICIOUS_REFERRERS.some((pattern) => pattern.test(referrer));
}

function isValidVisitor(ua: string, ip: string, referrer: string): boolean {
  if (isBot(ua)) return false;
  if (isDevelopmentIP(ip)) return false;
  if (isSuspiciousReferrer(referrer)) return false;
  if (ua.length < 20) return false;
  if (
    !ua.includes("Mozilla") &&
    !ua.includes("Safari") &&
    !ua.includes("Chrome")
  ) {
    return false;
  }
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectToDatabase();

  const { projectId, projectName } = req.body;

  if (!projectId || !projectName) {
    return res.status(400).json({ error: "Project ID and name are required" });
  }

  const clientIp =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.headers["x-real-ip"]?.toString() ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = (req.headers["user-agent"] || "").toString();
  const referrer = (
    req.headers["referer"] ||
    req.headers["referrer"] ||
    ""
  ).toString();

  // Enhanced filtering
  const isValid = isValidVisitor(userAgent, clientIp, referrer);

  if (!isValid) {
    return res.status(204).end();
  }

  try {
    // Look for existing project visit by this IP for this project
    const existing = await ProjectVisitor.findOne({ projectId, ip: clientIp });

    // Only increment visitCount if 30min have passed since lastVisit
    let shouldIncrement = true;
    if (existing && existing.lastVisit) {
      const minutesSinceLastVisit =
        (Date.now() - new Date(existing.lastVisit).getTime()) / (60 * 1000);
      shouldIncrement = minutesSinceLastVisit >= 30;
    }

    // Prepare update object
    const update: {
      lastVisit: Date;
      projectName: string;
      $inc?: { visitCount: number };
      country?: string;
      userAgent?: string;
      referrer?: string;
      isValidVisitor?: boolean;
      firstVisit?: Date;
    } = {
      lastVisit: new Date(),
      projectName, // Update project name in case it changed
      userAgent: userAgent.substring(0, 500),
      referrer: referrer.substring(0, 200),
      isValidVisitor: true,
    };

    if (shouldIncrement) {
      update.$inc = { visitCount: 1 };
    }

    // Set firstVisit only for new visitors
    if (!existing) {
      update.firstVisit = new Date();
    }

    // Get country with better error handling
    let country = existing?.country || "Unknown";
    if (clientIp !== "unknown" && !isDevelopmentIP(clientIp)) {
      try {
        const geo = await axios.get(
          `https://ipapi.co/${clientIp}/country_name/`,
          {
            timeout: 3000,
            headers: {
              "User-Agent": "Portfolio-Project-Tracker/1.0",
            },
          }
        );
        if (geo.data && typeof geo.data === "string" && geo.data.length > 0) {
          country = geo.data;
        }
      } catch {
        // Silently fail on geo errors
      }
    }
    update.country = country;

    await ProjectVisitor.findOneAndUpdate({ projectId, ip: clientIp }, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Project visitor tracking error:", err);
    res.status(500).json({ success: false });
  }
}
