import React from "react";

interface ProgressBarProps {
  percent: number;
  label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-xs text-gray-300 font-semibold">{label}</div>}
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-orange-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-400 mt-1 text-right">{percent}%</div>
    </div>
  );
} 