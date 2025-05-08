import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I’m Natan 👋
        </h1>
        <p className="text-xl mb-6 text-center max-w-xl">
          A passionate full-stack developer building web apps with React,
          Next.js, TypeScript, and MongoDB.
        </p>
        <div className="flex gap-4">
          <a
            href="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            View Projects
          </a>
          <a
            href="/contact"
            className="bg-transparent border border-white px-6 py-2 rounded hover:bg-white hover:text-black"
          >
            Contact Me
          </a>
        </div>
      </main>
    </>
  );
}
