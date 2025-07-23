import React from "react";
import StatusBadge from "./StatusBadge";

interface TimelineItem {
  date: string;
  label: string;
  status: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-col gap-4 border-l-2 border-orange-500/30 pl-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 relative">
          <div className="w-3 h-3 bg-orange-500 rounded-full absolute -left-5 top-1.5"></div>
          <div>
            <div className="text-xs text-gray-400 font-semibold">{item.date}</div>
            <div className="text-sm text-white font-medium">{item.label}</div>
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  );
} 