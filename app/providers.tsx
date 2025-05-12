// app/providers.jsx or app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Toaster } from "@/components/ui/toaster";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FavoritesProvider>
        {children}
        <Toaster />
      </FavoritesProvider>
    </SessionProvider>
  );
}