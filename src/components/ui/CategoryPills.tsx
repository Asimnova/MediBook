import {
  Zap, Gamepad2, Users, Clapperboard, HeartPulse,
  GraduationCap, Camera, Wallet, Music, Plane, AppWindow,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Zap, Gamepad2, Users, Clapperboard, HeartPulse,
  GraduationCap, Camera, Wallet, Music, Plane, AppWindow,
};

interface CategoryPillsProps {
  categories: Category[];
  active: string | 'all';
  onChange: (slug: string | 'all') => void;
}

export default function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`chip px-4 py-2 transition-all ${
          active === 'all'
            ? 'bg-brand-600 text-white shadow-soft'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-700'
        }`}
      >
        All
      </button>
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon_name] ?? AppWindow;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            className={`chip px-4 py-2 transition-all ${
              active === cat.slug
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
