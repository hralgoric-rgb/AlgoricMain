import React from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let color = "bg-gray-600 text-white";
  let icon = null;
  if (status.toLowerCase() === "paid") {
    color = "bg-green-600/90 text-white border border-green-400/40 shadow-green-400/20";
    icon = <CheckCircle className="inline w-4 h-4 mr-1 text-green-300" />;
  } else if (status.toLowerCase() === "pending") {
    color = "bg-orange-600/90 text-white border border-orange-400/40 shadow-orange-400/20";
    icon = <Clock className="inline w-4 h-4 mr-1 text-orange-300" />;
  } else if (status.toLowerCase() === "due soon") {
    color = "bg-yellow-500/90 text-black border border-yellow-400/40 shadow-yellow-400/20";
    icon = <AlertTriangle className="inline w-4 h-4 mr-1 text-yellow-600" />;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${color}`}>{icon}{status}</span>
  );
} 