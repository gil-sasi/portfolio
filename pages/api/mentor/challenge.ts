import { NextApiRequest, NextApiResponse } from "next";
import Challenge from "../../../models/Challenge";
import { connectToDatabase } from "../../../lib/mongodb";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Challenge templates and prompts
const challengePrompts = {
  beginner: {
    react:
      "Create a simple React component challenge suitable for beginners. Focus on basic props, state, and event handling.",
    javascript:
      "Create a JavaScript challenge for beginners focusing on fundamental concepts like variables, functions, and basic DOM manipulation.",
    css: "Create a CSS challenge for beginners focusing on layout, flexbox, or basic styling techniques.",
    typescript:
      "Create a TypeScript challenge for beginners focusing on basic types, interfaces, and type safety.",
    nextjs:
      "Create a Next.js challenge for beginners focusing on routing, components, or basic API routes.",
    node: "Create a Node.js challenge for beginners focusing on basic server concepts, file operations, or simple APIs.",
    general:
      "Create a general frontend challenge suitable for beginners covering HTML, CSS, and JavaScript fundamentals.",
  },
  intermediate: {
    react:
      "Create a React challenge for intermediate developers involving hooks, context, or component composition.",
    javascript:
      "Create a JavaScript challenge for intermediate developers involving async/await, array methods, or ES6+ features.",
    css: "Create a CSS challenge for intermediate developers involving animations, grid, or responsive design.",
    typescript:
      "Create a TypeScript challenge for intermediate developers involving generics, utility types, or advanced type patterns.",
    nextjs:
      "Create a Next.js challenge for intermediate developers involving SSR, SSG, or API integration.",
    node: "Create a Node.js challenge for intermediate developers involving Express, middleware, or database integration.",
    general:
      "Create a general frontend challenge for intermediate developers involving modern development practices and tools.",
  },
  advanced: {
    react:
      "Create an advanced React challenge involving performance optimization, custom hooks, or complex state management.",
    javascript:
      "Create an advanced JavaScript challenge involving design patterns, advanced async patterns, or optimization techniques.",
    css: "Create an advanced CSS challenge involving complex animations, custom properties, or advanced layout techniques.",
    typescript:
      "Create an advanced TypeScript challenge involving conditional types, mapped types, or complex type inference.",
    nextjs:
      "Create an advanced Next.js challenge involving optimization, middleware, or complex data fetching patterns.",
    node: "Create an advanced Node.js challenge involving microservices, performance optimization, or advanced architecture patterns.",
    general:
      "Create an advanced frontend challenge involving architecture, performance, or advanced development practices.",
  },
};

const generateChallenge = async (difficulty: string, category: string) => {
  // If no OpenAI API key is provided, use fallback challenges
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI API key found, using fallback challenge");
    return getFallbackChallenge(difficulty, category);
  }

  try {
    const prompt = `${
      challengePrompts[difficulty as keyof typeof challengePrompts][
        category as keyof typeof challengePrompts.beginner
      ]
    }

Please generate a coding challenge with the following structure:
- Title: A catchy, descriptive title
- Description: A clear problem statement (2-3 sentences)
- Requirements: 3-5 specific technical requirements
- Hints: 2-3 helpful hints without giving away the solution
- Technologies: Array of relevant technologies
- EstimatedTime: Time in minutes to complete
- ExampleCode: Optional starter code or example (if helpful)

Respond in JSON format with these exact field names:
{
  "title": "string",
  "description": "string", 
  "requirements": ["string"],
  "hints": ["string"],
  "technologies": ["string"],
  "estimatedTime": number,
  "exampleCode": "string or null"
}

Make it practical, engaging, and focused on real-world skills that would impress recruiters.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a senior developer creating coding challenges for junior developers. Focus on practical, real-world skills.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.log(`OpenAI API error: ${response.status}, using fallback`);
      return getFallbackChallenge(difficulty, category);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const parsedChallenge = JSON.parse(content);
      return {
        ...parsedChallenge,
        difficulty,
        category,
        isActive: true,
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Fallback challenge if AI parsing fails
      return getFallbackChallenge(difficulty, category);
    }
  } catch (error) {
    console.error("Error generating challenge:", error);
    return getFallbackChallenge(difficulty, category);
  }
};

const getFallbackChallenge = (difficulty: string, category: string) => {
  const fallbacks = {
    beginner: {
      react: {
        title: "Interactive Counter Component",
        description:
          "Build a React counter component with increment, decrement, and reset functionality. Add some styling to make it look professional.",
        requirements: [
          "Use useState hook for state management",
          "Include increment, decrement, and reset buttons",
          "Display the current count prominently",
          "Add basic styling with CSS or styled-components",
        ],
        hints: [
          "Remember to use useState to manage the counter state",
          "You can use onClick events to handle button clicks",
          "Consider adding disabled states for better UX",
        ],
        technologies: ["React", "JavaScript", "CSS"],
        estimatedTime: 30,
        exampleCode: null,
      },
      javascript: {
        title: "Simple Calculator",
        description:
          "Create a basic calculator that can perform addition, subtraction, multiplication, and division operations.",
        requirements: [
          "Create functions for basic math operations",
          "Handle user input validation",
          "Display results clearly",
          "Add error handling for division by zero",
        ],
        hints: [
          "Use parseFloat() to convert strings to numbers",
          "Consider using switch statements for operations",
          "Remember to validate input before calculations",
        ],
        technologies: ["JavaScript", "HTML", "CSS"],
        estimatedTime: 45,
        exampleCode: null,
      },
      css: {
        title: "Responsive Card Layout",
        description:
          "Design a responsive card layout that works on mobile and desktop using flexbox or CSS Grid.",
        requirements: [
          "Create at least 3 cards with image, title, and description",
          "Use flexbox or CSS Grid for layout",
          "Make it responsive for mobile devices",
          "Add hover effects on cards",
        ],
        hints: [
          "Use media queries for responsive design",
          "Consider using gap property for spacing",
          "Transform and transition properties for hover effects",
        ],
        technologies: ["CSS", "HTML"],
        estimatedTime: 40,
        exampleCode: null,
      },
      typescript: {
        title: "Basic Type Safety",
        description:
          "Convert a JavaScript function to TypeScript with proper type annotations and interface definitions.",
        requirements: [
          "Define interfaces for data structures",
          "Add type annotations to function parameters",
          "Use proper return types",
          "Handle optional properties",
        ],
        hints: [
          "Use interfaces for object types",
          "Optional properties use the ? symbol",
          "Array types can be defined as Type[] or Array<Type>",
        ],
        technologies: ["TypeScript", "JavaScript"],
        estimatedTime: 35,
        exampleCode: null,
      },
      nextjs: {
        title: "Simple Blog Page",
        description:
          "Create a basic blog page with static content using Next.js pages and components.",
        requirements: [
          "Create a blog post list page",
          "Create individual blog post pages",
          "Use Next.js Link component for navigation",
          "Add basic styling",
        ],
        hints: [
          "Use the pages directory for routing",
          "Link component from next/link for navigation",
          "Consider using getStaticProps for static content",
        ],
        technologies: ["Next.js", "React", "CSS"],
        estimatedTime: 50,
        exampleCode: null,
      },
      node: {
        title: "Simple REST API",
        description:
          "Create a basic REST API with Express.js that handles GET and POST requests for a simple resource.",
        requirements: [
          "Set up an Express.js server",
          "Create GET and POST endpoints",
          "Handle JSON request/response",
          "Add basic error handling",
        ],
        hints: [
          "Use express.json() middleware for parsing JSON",
          "HTTP status codes: 200 for success, 400 for errors",
          "Test your API with tools like Postman",
        ],
        technologies: ["Node.js", "Express.js", "JavaScript"],
        estimatedTime: 45,
        exampleCode: null,
      },
      general: {
        title: "Interactive Landing Page",
        description:
          "Build a responsive landing page with interactive elements using HTML, CSS, and JavaScript.",
        requirements: [
          "Create a hero section with call-to-action",
          "Add a responsive navigation menu",
          "Include interactive elements (forms, buttons)",
          "Make it mobile-friendly",
        ],
        hints: [
          "Use semantic HTML elements",
          "CSS Grid and Flexbox for layout",
          "Add event listeners for interactions",
        ],
        technologies: ["HTML", "CSS", "JavaScript"],
        estimatedTime: 60,
        exampleCode: null,
      },
    },
    intermediate: {
      react: {
        title: "Todo List with Local Storage",
        description:
          "Create a todo list application that persists data in localStorage. Include features like adding, editing, deleting, and filtering todos.",
        requirements: [
          "Add, edit, and delete todos functionality",
          "Mark todos as complete/incomplete",
          "Filter todos by status (all, active, completed)",
          "Persist data using localStorage",
          "Responsive design",
        ],
        hints: [
          "Use useEffect to load data from localStorage on mount",
          "Consider using a useReducer for complex state management",
          "Remember to handle edge cases like empty states",
        ],
        technologies: ["React", "JavaScript", "CSS", "localStorage"],
        estimatedTime: 90,
        exampleCode: null,
      },
      javascript: {
        title: "Weather App with API",
        description:
          "Build a weather application that fetches data from a weather API and displays current conditions and forecasts.",
        requirements: [
          "Fetch data from a weather API",
          "Display current weather conditions",
          "Show 5-day forecast",
          "Handle loading states and errors",
          "Add search functionality for cities",
        ],
        hints: [
          "Use async/await for API calls",
          "Handle API errors gracefully",
          "Consider using a weather service like OpenWeatherMap",
        ],
        technologies: ["JavaScript", "API", "HTML", "CSS"],
        estimatedTime: 120,
        exampleCode: null,
      },
      css: {
        title: "Advanced Animation Gallery",
        description:
          "Create an image gallery with advanced CSS animations and hover effects.",
        requirements: [
          "Create a grid-based image gallery",
          "Add smooth transitions and animations",
          "Implement hover effects with transforms",
          "Add a lightbox or modal for full-size images",
        ],
        hints: [
          "Use CSS transforms for smooth animations",
          "Transition property for hover effects",
          "Consider using CSS Grid for the layout",
        ],
        technologies: ["CSS", "HTML", "JavaScript"],
        estimatedTime: 80,
        exampleCode: null,
      },
      typescript: {
        title: "Generic Data Fetcher",
        description:
          "Create a generic data fetching utility with TypeScript that can work with different API endpoints and data types.",
        requirements: [
          "Use TypeScript generics for type safety",
          "Handle different HTTP methods (GET, POST, PUT, DELETE)",
          "Implement proper error handling",
          "Add retry logic for failed requests",
        ],
        hints: [
          "Use generic types <T> for flexible typing",
          "async/await for handling promises",
          "Consider using union types for different response types",
        ],
        technologies: ["TypeScript", "JavaScript", "API"],
        estimatedTime: 100,
        exampleCode: null,
      },
      nextjs: {
        title: "Dynamic Blog with API Routes",
        description:
          "Build a blog application with dynamic pages and API routes for managing blog posts.",
        requirements: [
          "Create dynamic blog post pages",
          "Implement API routes for CRUD operations",
          "Add a simple admin interface",
          "Use getServerSideProps or getStaticProps",
        ],
        hints: [
          "Use [slug].js for dynamic routing",
          "API routes go in pages/api directory",
          "Consider using a headless CMS or JSON files",
        ],
        technologies: ["Next.js", "React", "API Routes", "CSS"],
        estimatedTime: 140,
        exampleCode: null,
      },
      node: {
        title: "User Authentication System",
        description:
          "Build a complete user authentication system with registration, login, and protected routes.",
        requirements: [
          "User registration and login endpoints",
          "Password hashing with bcrypt",
          "JWT token authentication",
          "Protected route middleware",
          "Email validation",
        ],
        hints: [
          "Use bcrypt for password hashing",
          "JWT tokens for session management",
          "Middleware for route protection",
        ],
        technologies: ["Node.js", "Express.js", "JWT", "bcrypt"],
        estimatedTime: 160,
        exampleCode: null,
      },
      general: {
        title: "Progressive Web App",
        description:
          "Convert a regular web application into a Progressive Web App (PWA) with offline functionality.",
        requirements: [
          "Add a service worker for caching",
          "Create a web app manifest",
          "Implement offline functionality",
          "Add install prompt",
        ],
        hints: [
          "Service workers handle background tasks",
          "Cache API for offline storage",
          "Web app manifest for installability",
        ],
        technologies: ["JavaScript", "Service Worker", "PWA", "HTML", "CSS"],
        estimatedTime: 130,
        exampleCode: null,
      },
    },
    advanced: {
      react: {
        title: "Real-time Chat Interface",
        description:
          "Build a real-time chat interface with message history, typing indicators, and user presence. Focus on performance and user experience.",
        requirements: [
          "Real-time message sending and receiving",
          "Message history with pagination",
          "Typing indicators",
          "User online/offline status",
          "Optimistic updates for better UX",
        ],
        hints: [
          "Consider using WebSockets or a real-time service",
          "Implement virtual scrolling for large message lists",
          "Use React.memo and useMemo for performance optimization",
        ],
        technologies: ["React", "TypeScript", "WebSocket", "CSS"],
        estimatedTime: 180,
        exampleCode: null,
      },
      javascript: {
        title: "Custom Framework Implementation",
        description:
          "Build a mini JavaScript framework with virtual DOM, component system, and state management.",
        requirements: [
          "Implement a virtual DOM system",
          "Create a component-based architecture",
          "Add state management capabilities",
          "Implement efficient diffing algorithm",
        ],
        hints: [
          "Virtual DOM is just JavaScript objects representing DOM",
          "Diffing algorithm compares old and new virtual DOM trees",
          "Use proxies for reactive state management",
        ],
        technologies: ["JavaScript", "Virtual DOM", "Architecture"],
        estimatedTime: 240,
        exampleCode: null,
      },
      css: {
        title: "3D CSS Animation Scene",
        description:
          "Create a complex 3D scene using only CSS with multiple animated elements and camera movements.",
        requirements: [
          "Use CSS 3D transforms extensively",
          "Create multiple animated 3D objects",
          "Implement camera-like movements",
          "Add lighting effects with CSS",
        ],
        hints: [
          "transform-style: preserve-3d is crucial",
          "Use perspective for 3D depth",
          "Keyframes for complex animations",
        ],
        technologies: ["CSS", "3D Transforms", "Animations"],
        estimatedTime: 200,
        exampleCode: null,
      },
      typescript: {
        title: "Advanced Type System",
        description:
          "Create a complex type system with conditional types, mapped types, and template literal types.",
        requirements: [
          "Use conditional types for type inference",
          "Implement mapped types for transformations",
          "Create template literal types",
          "Build a type-safe API client",
        ],
        hints: [
          "Conditional types use extends keyword",
          "Mapped types iterate over object properties",
          "Template literal types for string manipulation",
        ],
        technologies: ["TypeScript", "Advanced Types", "Type System"],
        estimatedTime: 160,
        exampleCode: null,
      },
      nextjs: {
        title: "Full-Stack E-commerce Platform",
        description:
          "Build a complete e-commerce platform with payment integration, inventory management, and admin dashboard.",
        requirements: [
          "Product catalog with search and filtering",
          "Shopping cart and checkout process",
          "Payment integration (Stripe/PayPal)",
          "Admin dashboard for inventory",
          "User authentication and orders",
        ],
        hints: [
          "Use Next.js API routes for backend",
          "Implement proper state management",
          "Consider using a database like MongoDB",
        ],
        technologies: ["Next.js", "React", "API Routes", "Database", "Payment"],
        estimatedTime: 300,
        exampleCode: null,
      },
      node: {
        title: "Microservices Architecture",
        description:
          "Design and implement a microservices architecture with API gateway, service discovery, and distributed logging.",
        requirements: [
          "Create multiple independent services",
          "Implement API gateway for routing",
          "Add service discovery mechanism",
          "Set up distributed logging",
          "Handle inter-service communication",
        ],
        hints: [
          "Use containers for service isolation",
          "Event-driven architecture for communication",
          "Circuit breaker pattern for resilience",
        ],
        technologies: ["Node.js", "Microservices", "Docker", "Architecture"],
        estimatedTime: 280,
        exampleCode: null,
      },
      general: {
        title: "Performance Optimization Suite",
        description:
          "Create a comprehensive performance optimization suite for web applications with monitoring and analysis tools.",
        requirements: [
          "Implement performance monitoring",
          "Create automated optimization recommendations",
          "Add bundle analysis and optimization",
          "Build real-time performance dashboard",
        ],
        hints: [
          "Use Performance API for measurements",
          "Lighthouse for performance audits",
          "Webpack Bundle Analyzer for bundle optimization",
        ],
        technologies: [
          "JavaScript",
          "Performance",
          "Monitoring",
          "Optimization",
        ],
        estimatedTime: 220,
        exampleCode: null,
      },
    },
  };

  const fallbackChallenge =
    fallbacks[difficulty as keyof typeof fallbacks]?.[
      category as keyof typeof fallbacks.beginner
    ] || fallbacks.beginner.react;

  return {
    ...fallbackChallenge,
    difficulty,
    category,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { difficulty = "beginner", category = "react", userId } = req.body;

    // Validate input
    const validDifficulties = ["beginner", "intermediate", "advanced"];
    const validCategories = [
      "react",
      "javascript",
      "css",
      "typescript",
      "nextjs",
      "node",
      "general",
    ];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty level" });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Generate challenge using AI
    const challengeData = await generateChallenge(difficulty, category);

    // Save to database
    const challenge = new Challenge({
      ...challengeData,
      userId: userId || null,
    });

    await challenge.save();

    res.status(200).json({
      success: true,
      challenge: {
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        category: challenge.category,
        requirements: challenge.requirements,
        hints: challenge.hints,
        technologies: challenge.technologies,
        estimatedTime: challenge.estimatedTime,
        exampleCode: challenge.exampleCode,
        createdAt: challenge.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in challenge API:", error);
    res.status(500).json({
      message: "Failed to generate challenge",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
