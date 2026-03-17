import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Toast: React.FC = () => {
  const { toast, setToast } = useStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] bg-white",
        bgColors[toast.type]
      )}>
        {icons[toast.type]}
        <p className="text-sm font-medium text-gray-900 flex-1">{toast.message}</p>
        <button 
          onClick={() => setToast(null)}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
