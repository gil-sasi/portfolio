import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import axios from "axios";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  firstVisit: { type: Date, default: Date.now },
  country: { type: String, default: "Unknown" },
  userAgent: { type: String, default: "" },
  referrer: { type: String, default: "" },
  isValidVisitor: { type: Boolean, default: true },
});

const Visitor =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

// Enhanced bot detection patterns
const BOT_PATTERNS = [
  // Search engine bots
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit/i,
  // Social media crawlers
  /twitterbot|linkedinbot|whatsapp|telegram|discord|slack/i,
  // Development and monitoring
  /curl|wget|postman|insomnia|httpie|axios|fetch|node|python|ruby|go-http|java|php/i,
  // Deployment platforms
  /vercel|netlify|github|gitlab|travis|jenkins|circleci|heroku|aws/i,
  // Security scanners
  /nmap|nikto|sqlmap|burpsuite|owasp|security|scanner/i,
  // Generic bot patterns
  /bot|crawl|spider|scraper|checker|monitor|uptime|health|preview|meta|validator/i,
  // Headless browsers
  /headless|phantom|selenium|playwright|puppeteer/i,
];

// Known development/testing IPs or ranges (you can expand this)
const DEVELOPMENT_IPS = [
  "127.0.0.1",
  "::1",
  "localhost",
  // Add your development IPs here if needed
];

// Suspicious referrer patterns
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
  return (
    DEVELOPMENT_IPS.includes(ip) ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip === "unknown"
  );
}

function isSuspiciousReferrer(referrer: string): boolean {
  if (!referrer) return false;
  return SUSPICIOUS_REFERRERS.some((pattern) => pattern.test(referrer));
}

function isValidVisitor(ua: string, ip: string, referrer: string): boolean {
  // Check if it's a bot
  if (isBot(ua)) return false;

  // Temporarily allow development IPs for debugging
  // if (isDevelopmentIP(ip)) return false;

  // Temporarily allow suspicious referrers for debugging
  // if (isSuspiciousReferrer(referrer)) return false;

  // Check for very short user agents (likely automated)
  if (ua.length < 20) return false;

  // Check for missing common browser headers
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
  await connectToDatabase();

  const ip =
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
  const isValid = isValidVisitor(userAgent, ip, referrer);

  // Temporary debugging
  console.log("Visitor tracking attempt:", {
    ip,
    userAgent: userAgent.substring(0, 100),
    referrer: referrer.substring(0, 100),
    isValid,
    isDevelopment: isDevelopmentIP(ip),
    isBot: isBot(userAgent),
    isSuspiciousReferrer: isSuspiciousReferrer(referrer),
  });

  if (!isValid) {
    // Optionally log suspicious visits for debugging
    console.log("Filtered out visit:", {
      ip,
      userAgent: userAgent.substring(0, 100),
      referrer,
    });
    return res.status(204).end();
  }

  try {
    // Lookup visitor by IP
    const existing = await Visitor.findOne({ ip });

    // Only increment visitCount if 30min have passed since lastVisit (reduced from 50min)
    let shouldIncrement = true;
    if (existing && existing.lastVisit) {
      const minutesSinceLastVisit =
        (Date.now() - new Date(existing.lastVisit).getTime()) / (60 * 1000);
      shouldIncrement = minutesSinceLastVisit >= 30;
    }

    // Prepare update object
    const update: {
      lastVisit: Date;
      $inc?: { visitCount: number };
      country?: string;
      userAgent?: string;
      referrer?: string;
      isValidVisitor?: boolean;
      firstVisit?: Date;
    } = {
      lastVisit: new Date(),
      userAgent: userAgent.substring(0, 500), // Limit length
      referrer: referrer.substring(0, 200), // Limit length
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
    if (ip !== "unknown" && !isDevelopmentIP(ip)) {
      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/country_name/`, {
          timeout: 3000, // 3 second timeout
          headers: {
            "User-Agent": "Portfolio-Visitor-Tracker/1.0",
          },
        });
        if (geo.data && typeof geo.data === "string" && geo.data.length > 0) {
          country = geo.data;
        }
      } catch {
        // Don't block on geo errors, but optionally log for debugging
        // console.log("Geo lookup failed for IP:", ip);
      }
    }
    update.country = country;

    await Visitor.findOneAndUpdate({ ip }, update, { upsert: true, new: true });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Visitor tracking error:", err);
    res.status(500).json({ success: false });
  }
}
