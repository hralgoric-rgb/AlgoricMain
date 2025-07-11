'use client'


import { SessionProvider } from "next-auth/react"
import React from "react"

export default function AuthProvider({
  children,
}: {children: React.ReactNode}) {
  return (
    <SessionProvider basePath="/microestate/api/auth" >
      {children}
    </SessionProvider>
  )
}