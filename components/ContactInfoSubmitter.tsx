// "use client";

// import { useState } from "react";
// import axios from "axios";

// export default function ContactInfoSubmitter() {
//   const [email, setEmail] = useState("gilsasiy@gmail.com");
//   const [linkedin, setLinkedin] = useState(
//     "https://linkedin.com/in/gil-sasi-8b39451b2"
//   );
//   const [github, setGithub] = useState("https://github.com/deadly91");
//   const [status, setStatus] = useState("");

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setStatus("No token found. Please login as admin.");
//       return;
//     }

//     try {
//       await axios.post(
//         "/api/admin/contact-info",
//         {
//           email,
//           socials: [
//             { platform: "LinkedIn", url: linkedin },
//             { platform: "GitHub", url: github },
//           ],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setStatus("✅ Contact info saved successfully!");
//     } catch (err) {
//       console.error(err);
//       setStatus("❌ Failed to save contact info");
//     }
//   };

//   return (
//     <div className="text-white space-y-4 p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold text-center">
//         Submit Contact Info (Admin Only)
//       </h1>

//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Admin Email"
//         className="w-full p-2 bg-gray-800 rounded border border-gray-600"
//       />
//       <input
//         type="url"
//         value={linkedin}
//         onChange={(e) => setLinkedin(e.target.value)}
//         placeholder="LinkedIn URL"
//         className="w-full p-2 bg-gray-800 rounded border border-gray-600"
//       />
//       <input
//         type="url"
//         value={github}
//         onChange={(e) => setGithub(e.target.value)}
//         placeholder="GitHub URL"
//         className="w-full p-2 bg-gray-800 rounded border border-gray-600"
//       />

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
//       >
//         Save Contact Info
//       </button>

//       {status && <p className="text-center text-sm mt-2">{status}</p>}
//     </div>
//   );
// }
