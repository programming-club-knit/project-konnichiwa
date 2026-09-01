"use client";

import { usePathname } from "next/navigation";
import { Pointer } from "@/components/ui/pointer";
import { useEffect } from "react";

export function GlobalPointer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove("has-custom-pointer");
      document.body.style.removeProperty("cursor");
      document.documentElement.style.removeProperty("cursor");
    } else {
      document.body.classList.add("has-custom-pointer");
    }

    return () => {
      document.body.classList.remove("has-custom-pointer");
      document.body.style.removeProperty("cursor");
      document.documentElement.style.removeProperty("cursor");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return null;
  }

  return <Pointer className="fill-[#F47174] text-[#F47174] stroke-white" />;
}
