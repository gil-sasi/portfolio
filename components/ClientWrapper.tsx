"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setUserFromToken } from "../redux/slices/authSlice";
import Navbar from "./Navbar";

function AuthGate() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("🚀 Running setUserFromToken in AuthGate");
    dispatch(setUserFromToken());

    fetch("/api/skills").catch(() => {
      console.log("🧊 Warming up /api/skills route");
    });
  }, [dispatch]);

  return null;
}

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthGate />
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="px-4 py-10">{children}</main>
      </div>
    </Provider>
  );
}
