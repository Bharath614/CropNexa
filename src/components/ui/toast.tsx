'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/90 border-emerald-800 text-emerald-100',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90 border-rose-800 text-rose-100',
          icon: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 border-amber-800 text-amber-100',
          icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/90 border-slate-800 text-slate-100',
          icon: <Info className="h-5 w-5 text-sky-400 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`
        pointer-events-auto border backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-start justify-between gap-3
        transform transition-all duration-300 animate-slideUp ${style.bg}
      `}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="space-y-0.5">
          <h5 className="text-xs font-extrabold tracking-tight">{toast.title}</h5>
          <p className="text-[11px] opacity-90 leading-snug">{toast.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
