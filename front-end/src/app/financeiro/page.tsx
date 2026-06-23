"use client";

import { useUser } from "@/context/UserContext";
import { FinancialPage } from "@/components/FinancalPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { commerce } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!commerce) {
      router.replace("/");
    }
  }, [commerce, router]);

  if (!commerce) return null;

  return <FinancialPage commerce={commerce} />;
}
