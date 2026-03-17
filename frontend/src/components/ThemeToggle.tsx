import React from 'react';
import { Sun, Moon, Zap, Cloud } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ThemeType } from '../store/useStore';

const themes: { id: ThemeType; icon: React.ReactNode; label: string; color: string }[] = [
  { id: 'default', icon: <Sun className="w-4 h-4" />, label: 'Light', color: 'bg-blue-500' },
  { id: 'glass', icon: <Cloud className="w-4 h-4" />, label: 'Glass', color: 'bg-sky-400' },
  { id: 'midnight', icon: <Moon className="w-4 h-4" />, label: 'Midnight', color: 'bg-indigo-950' },
  { id: 'cyberpunk', icon: <Zap className="w-4 h-4" />, label: 'Cyber', color: 'bg-pink-500' },
];

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useStore();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className={`
            flex items-center justify-center w-8 h-8 rounded-md transition-all
            ${theme === t.id 
              ? `${t.color} text-white shadow-sm ring-2 ring-primary/20` 
              : 'hover:bg-secondary text-muted-foreground'}
          `}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
