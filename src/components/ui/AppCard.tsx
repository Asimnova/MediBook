import { Download, Star, Heart } from 'lucide-react';
import type { AppWithCategory } from '@/types';
import RatingStars from './RatingStars';
import { useRouter } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface AppCardProps {
  app: AppWithCategory;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function AppCard({ app, isFavorite, onFavoriteToggle }: AppCardProps) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [fav, setFav] = useState(isFavorite ?? false);

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (fav) {
      await supabase.from('favorites').delete().eq('app_id', app.id).eq('user_id', user.id);
      setFav(false);
    } else {
      await supabase.from('favorites').insert({ app_id: app.id });
      setFav(true);
    }
    onFavoriteToggle?.();
  };

  return (
    <div
      onClick={() => navigate(`/app/${app.id}`)}
      className="card group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <img
          src={app.screenshot_url}
          alt={app.name}
          loading="lazy"
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={toggleFav}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-all hover:scale-110"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${fav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <img
            src={app.icon_url}
            alt={app.name}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-100"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-semibold text-slate-900 group-hover:text-brand-700">
              {app.name}
            </h3>
            <p className="truncate text-xs text-slate-500">{app.developer}</p>
          </div>
        </div>

        {app.category && (
          <span className="chip mt-3 bg-slate-100 text-slate-600 self-start">
            {app.category.name}
          </span>
        )}

        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{app.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{app.rating.toFixed(1)}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Download className="h-3.5 w-3.5" />
            {app.downloads}
          </span>
        </div>
      </div>
    </div>
  );
}
