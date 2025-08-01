🧩 Page Structure & Design
Every new page must follow the same design language as existing pages.

Use consistent layout patterns, padding, spacing, and animations.

Reuse layout wrappers like <Navbar>, <BackgroundWrapper>, etc.

Do not invent new layouts unless explicitly requested.

🔁 Data Fetching
Always use React Query (@tanstack/react-query) for all data fetching and mutations.

Avoid using raw fetch() or axios directly in components or useEffect.

Implement proper caching, queryKeys, and use onSuccess / onError callbacks when needed.

⚛️ React Best Practices
Use useCallback() for all function props passed to child components.

Use React.memo() to wrap components that don’t rely on frequent re-renders.

Use useMemo() for computed values or filtered lists.

Keep code modular and organized — no large monolithic files.

🧱 Reusable Components
If a component or UI element is used in more than one place, make it reusable.

Place shared components in the components/ folder with clear names.

Always check if a reusable component already exists before creating a new one.

Translate pages hebrew/english do not use HARDCODED text

do not use 'any' variable in my code, i want to upload it to vercel!

I am using redux toolkit, and user is storage in state.auth.user - make sure you know that

Do not use hardcoded text in pages/new pages. always translate hebrew/english in the src/i18n/config.ts

You need to make sure you dont mess up with the code that we can deploy it to vercel after
