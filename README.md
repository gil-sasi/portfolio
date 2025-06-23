This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Visitor Tracking System

### Enhanced Bot Detection & Filtering

The visitor tracking system has been improved to filter out unwanted traffic including:

#### Server-side Filtering (`/api/track-visitor`)

- **Bot Detection**: Comprehensive patterns for search engines, social media crawlers, development tools, deployment platforms, security scanners, and headless browsers
- **Development IP Filtering**: Blocks localhost, private networks (192.168.x.x, 10.x.x.x, 172.16.x.x)
- **Suspicious Referrers**: Filters traffic from deployment platforms (vercel.app, netlify.app, etc.)
- **User Agent Validation**: Checks for minimum length and browser signatures
- **Rate Limiting**: Only increments visit count after 30 minutes between visits

#### Client-side Filtering (`TrackVisit` component)

- **Development Mode**: Skips tracking in development environment
- **Iframe Detection**: Ignores embedded content
- **Screen Validation**: Filters out requests without valid screen dimensions
- **Session Limiting**: Only tracks once per browser session
- **Bot Pattern Detection**: Client-side user agent validation

#### Enhanced Data Collection

- **First Visit Tracking**: Records when a visitor first accessed the site
- **User Agent Storage**: Stores browser information for analysis
- **Referrer Tracking**: Records where visitors came from
- **Validity Flagging**: Marks visitors as valid/invalid for filtering

#### Admin Features

- **Clean Display**: Shows only valid visitors by default
- **Cleanup Tool**: One-click removal of invalid visitor records
- **Enhanced Details**: Browser type, device type, and referrer information
- **Statistics**: Shows valid vs invalid visitor counts

#### Database Schema Updates

```typescript
interface Visitor {
  ip: string;
  visitCount: number;
  lastVisit: Date;
  firstVisit: Date;
  country: string;
  userAgent: string;
  referrer: string;
  isValidVisitor: boolean;
}
```

### Usage

The system automatically filters most unwanted traffic, but admins can:

1. View visitor statistics in the admin panel
2. Use the "Clean Up" button to remove invalid records
3. Monitor the valid/invalid visitor ratio

For developers:

- Development traffic is automatically ignored
- The system logs filtered requests for debugging (commented out by default)
- Geo-location lookup includes timeout and error handling

## Project-Specific Visitor Tracking

### Overview

In addition to general site visitors, the system now tracks visits to individual projects, providing detailed analytics for each portfolio project.

### Features

#### Project Analytics Dashboard

- **Project Overview**: Summary cards showing total visits, unique visitors, countries, and last visit date
- **Detailed Visitor Data**: Click on any project to see individual visitor details
- **Real-time Statistics**: Live tracking of project popularity and engagement

#### Project Visit Data

- **Per-Project Tracking**: Separate visitor counts for each project
- **Visitor Details**: IP, country, browser, device type, visit history
- **Referrer Tracking**: See where visitors are coming from
- **Time-based Analytics**: First visit and last visit timestamps

#### Implementation

```tsx
// Add to any project page
import TrackProjectVisit from "../../components/TrackProjectVisit";

export default function ProjectPage() {
  return (
    <div>
      <TrackProjectVisit
        projectId="unique-project-id"
        projectName="Display Name for Project"
      />
      {/* Rest of your project content */}
    </div>
  );
}
```

#### API Endpoints

- `POST /api/track-project-visit` - Track a project visit
- `GET /api/admin/project-visitors?summary=true` - Get project statistics
- `GET /api/admin/project-visitors?projectId=X` - Get visitors for specific project
- `DELETE /api/admin/project-visitors` - Clean up invalid records

#### Database Schema

```typescript
interface ProjectVisitor {
  projectId: string; // Unique identifier for the project
  projectName: string; // Display name for the project
  ip: string; // Visitor IP address
  visitCount: number; // Number of visits from this IP
  lastVisit: Date; // Most recent visit timestamp
  firstVisit: Date; // First visit timestamp
  country: string; // Visitor's country
  userAgent: string; // Browser/device information
  referrer: string; // Where the visitor came from
  isValidVisitor: boolean; // Filter flag for bot detection
}
```

### Benefits

1. **Project Performance**: See which projects are most popular
2. **Visitor Insights**: Understand your audience per project
3. **Geographic Analytics**: Know where interest in specific projects comes from
4. **Engagement Tracking**: Monitor repeat visitors to projects
5. **Portfolio Optimization**: Focus on successful project types

### Admin Interface

Access project analytics through the admin panel:

1. Login to admin dashboard
2. Click "Project Analytics" in the sidebar
3. View project overview cards
4. Click any project for detailed visitor information
5. Sort projects by popularity, recent activity, or visitor count
