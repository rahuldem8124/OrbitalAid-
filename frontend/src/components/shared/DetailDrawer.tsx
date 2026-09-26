"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export default function DetailDrawer({ open, onClose, title, children, width = "w-full max-w-md" }: DetailDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full bg-[#111827] border-l border-[#1e293b] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${width} ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
