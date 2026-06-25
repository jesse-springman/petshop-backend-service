"use client";

import { useUser } from "@/context/UserContext";
import { NewExpensePage } from "@/components/novaDespesa";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { commerce } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!commerce) router.replace("/");
  }, [commerce, router]);

  if (!commerce) return null;

  return <NewExpensePage commerce={commerce} />;
}
