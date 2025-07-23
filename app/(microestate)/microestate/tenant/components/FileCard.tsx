import React from "react";
import { FileText, Eye, Download } from "lucide-react";

interface FileCardProps {
  name: string;
  type: string;
  uploadedDate: string;
  onDownload: () => void;
  onView?: () => void;
}

function getIcon(type: string) {
  // Use FileText for all types to avoid import issues
  return <FileText className="w-6 h-6 text-orange-500" />;
}

export default function FileCard({ name, type, uploadedDate, onDownload, onView }: FileCardProps) {
  return (
    <div className="flex items-center justify-between bg-[#181c24] border border-orange-500/20 rounded-lg p-4 mb-2 shadow-sm">
      <div className="flex items-center gap-3">
        {getIcon(type)}
        <div>
          <div className="font-semibold text-white text-sm">{name}</div>
          <div className="text-xs text-gray-400">Uploaded: {uploadedDate}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {onView && (
          <button onClick={onView} className="p-2 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-500">
            <Eye className="w-4 h-4" />
          </button>
        )}
        <button onClick={onDownload} className="p-2 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-500">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 