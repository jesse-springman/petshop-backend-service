"use client";

import { useUser } from "@/context/UserContext";
import { Commerce } from "@/types/commerce";
import HomePage from "./HomePage";

export default function HomeWrapper() {
  const { commerce, loading } = useUser();

  if (loading) return <div className="min-h-screen bg-[#080B0E]" />;

  return <HomePage commerce={(commerce as Commerce) ?? "PETSHOP"} />;
}
