import React from 'react';
import { Sparkles, Trophy, CheckCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'discovery' | 'score' | 'info';
  title: string;
  description: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-14 left-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none font-mono">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className={`pointer-events-auto cursor-pointer p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md animate-slide-up transition-all ${
            toast.type === 'discovery'
              ? 'bg-[#0f2414]/95 border-[#8BAC0F] text-[#e2f0fd]'
              : toast.type === 'score'
              ? 'bg-[#291e0a]/95 border-yellow-500 text-[#ffeada]'
              : 'bg-[#101b2b]/95 border-sky-500 text-[#e2f0fd]'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'discovery' && <Sparkles className="w-5 h-5 text-[#8BAC0F] animate-bounce" />}
            {toast.type === 'score' && <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>

          <div className="min-w-0">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              {toast.title}
            </h5>
            <p className="text-[11px] opacity-90 mt-0.5 line-clamp-2">
              {toast.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
