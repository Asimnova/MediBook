import { useState, useEffect } from 'react';
import { Heart, Loader2, Smartphone, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import AppCard from '@/components/ui/AppCard';
import type { App, Category } from '@/types';

export default function FavoritesPage() {
  const { navigate } = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData ?? []);
    }
    load();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    async function loadFavorites() {
      if (!user) return;
      setLoading(true);
      const { data: favs } = await supabase
        .from('favorites')
        .select('app_id')
        .eq('user_id', user.id);

      const favIds = (favs ?? []).map((f) => f.app_id);
      if (favIds.length === 0) {
        setApps([]);
        setLoading(false);
        return;
      }

      const { data: appsData } = await supabase
        .from('apps')
        .select('*')
        .in('id', favIds);
      setApps(appsData ?? []);
      setLoading(false);
    }
    loadFavorites();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <LogIn className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-slate-900">Sign in to view favorites</h1>
        <p className="mt-2 text-slate-500">Save your favorite apps and access them anytime.</p>
        <button onClick={() => navigate('/auth')} className="btn-primary mt-6">
          Login / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-slate-900">
          <Heart className="h-7 w-7 fill-rose-500 text-rose-500" />
          My Favorites
        </h1>
        <p className="mt-1.5 text-slate-500">
          {apps.length > 0
            ? `You have ${apps.length} saved app${apps.length !== 1 ? 's' : ''}.`
            : 'Apps you save will appear here.'}
        </p>
      </div>

      {apps.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={{ ...app, category: categories.find((c) => c.id === app.category_id) }}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Smartphone className="h-7 w-7" />
          </span>
          <h3 className="font-display text-lg font-semibold text-slate-900">No favorites yet</h3>
          <p className="max-w-xs text-sm text-slate-500">Browse apps and tap the heart icon to save them.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-2">
            Discover apps
          </button>
        </div>
      )}
    </div>
  );
}
