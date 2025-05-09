"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold">Welcome to the Admin Panel</h1>
      {/* Admin content here */}
    </div>
  );
}
