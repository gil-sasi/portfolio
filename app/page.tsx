import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-center">
          Hi, I’m <span className="text-blue-500">Gil</span> 👋
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 text-center max-w-2xl mb-10">
          A passionate full-stack developer building powerful web apps using
          React, Next.js, TypeScript & MongoDB.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            🚀 View Projects
          </a>
          <a
            href="/contact"
            className="border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg transition"
          >
            📬 Contact Me
          </a>
        </div>
      </main>
    </>
  );
}
