"use client";
import Image from "next/image";

export default function BarbershopProjectPage() {
  return (
    <main className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">💈 Barbershop App</h1>

      <Image
        src="/assets/projects/barbershop-preview.png"
        alt="Barbershop App Screenshot"
        width={800}
        height={400}
        className="rounded-xl mb-4"
      />

      <p className="mb-4">
        A mobile app that allows clients to book appointments with barbers,
        while barbers can manage their weekly schedules, offer products through
        an integrated shop, and receive booking notifications in real-time.
      </p>

      <ul className="list-disc pl-6 mb-4">
        <li>Client & barber authentication</li>
        <li>Weekly schedule management</li>
        <li>Appointment booking system</li>
        <li>Real-time notifications via Expo</li>
        <li>Online product shop</li>
      </ul>

      <a
        href="https://github.com/your-username/barbershop-app"
        target="_blank"
        className="text-blue-400 underline"
      >
        View on GitHub
      </a>
    </main>
  );
}
