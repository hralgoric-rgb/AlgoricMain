import React from "react";

export default function TenantFooter() {
  return (
    <footer className="w-full py-4 bg-black/90 border-t border-orange-500/10 text-gray-400 text-center text-xs sticky bottom-0 z-40">
      &copy; {new Date().getFullYear()} Microestate. All rights reserved.
    </footer>
  );
} 