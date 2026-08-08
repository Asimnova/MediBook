import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, Sparkles, ArrowRight, Loader2, Smartphone } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import CategoryPills from '@/components/ui/CategoryPills';
import AppCard from '@/components/ui/AppCard';
import RatingStars from '@/components/ui/RatingStars';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import type { App, Category } from '@/types';

export default function DiscoverPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const [{ data: appsData }, { data: catData }] = await Promise.all([
        supabase.from('apps').select('*').order('rating', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);
      setApps(appsData ?? []);
      setCategories(catData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('favorites')
      .select('app_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavoriteIds(new Set((data ?? []).map((f) => f.app_id)));
      });
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((app) => {
      if (activeCategory !== 'all') {
        const cat = categories.find((c) => c.slug === activeCategory);
        if (cat && app.category_id !== cat.id) return false;
      }
      if (q && !app.name.toLowerCase().includes(q) && !app.developer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [apps, categories, search, activeCategory]);

  const featured = apps.filter((a) => a.featured).slice(0, 4);
  const topRated = [...apps].sort((a, b) => b.rating - a.rating).slice(0, 6);

  const heroImage = 'https://images.pexels.com/photos/27574955/pexels-photo-27574955.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent-100/40 blur-3xl" />
        <div className="container-page relative py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip bg-brand-100 text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Discover your next favorite app
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Great <span className="text-brand-600">Mobile Apps</span> You'll Love
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Browse thousands of apps across every category. Read reviews, compare ratings, and save your favorites — all in one place.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-slate-100">
                <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search apps by name or developer..."
                  className="w-full bg-transparent py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button onClick={() => navigate('/')} className="btn-primary shrink-0 px-6 py-3">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Apps Listed', value: `${apps.length}+` },
              { label: 'Categories', value: `${categories.length}` },
              { label: 'Total Downloads', value: '300M+' },
              { label: 'Avg. Rating', value: '4.6' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className="container-page py-16">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-3xl font-bold text-slate-900">
                    <TrendingUp className="h-7 w-7 text-brand-600" />
                    Featured Apps
                  </h2>
                  <p className="mt-2 text-slate-500">Hand-picked apps worth your attention.</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((app) => (
                  <AppCard
                    key={app.id}
                    app={{ ...app, category: categories.find((c) => c.id === app.category_id) }}
                    isFavorite={favoriteIds.has(app.id)}
                    onFavoriteToggle={() =>
                      setFavoriteIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(app.id)) next.delete(app.id);
                        else next.add(app.id);
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* Browse with filters */}
          <section className="container-page py-16">
            <div className="mb-6">
              <h2 className="font-display text-3xl font-bold text-slate-900">Browse all apps</h2>
              <p className="mt-2 text-slate-500">Filter by category and search to find exactly what you need.</p>
            </div>

            <div className="mb-6 flex flex-col gap-4">
              <SearchBar value={search} onChange={setSearch} />
              <CategoryPills categories={categories} active={activeCategory} onChange={setActiveCategory} />
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((app) => (
                  <AppCard
                    key={app.id}
                    app={{ ...app, category: categories.find((c) => c.id === app.category_id) }}
                    isFavorite={favoriteIds.has(app.id)}
                    onFavoriteToggle={() =>
                      setFavoriteIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(app.id)) next.delete(app.id);
                        else next.add(app.id);
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Smartphone className="h-7 w-7" />
                </span>
                <h3 className="font-display text-lg font-semibold text-slate-900">No apps found</h3>
                <p className="max-w-xs text-sm text-slate-500">Try a different search or category.</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all'); }}
                  className="btn-secondary mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Top rated */}
          <section className="bg-brand-50/50 py-16">
            <div className="container-page">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-slate-900">Top rated</h2>
                  <p className="mt-2 text-slate-500">The highest-rated apps in our directory.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn-secondary hidden sm:flex">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topRated.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigate(`/app/${app.id}`)}
                    className="card group flex items-center gap-4 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <img src={app.icon_url} alt={app.name} className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-100" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-base font-semibold text-slate-900 group-hover:text-brand-700">{app.name}</h3>
                      <p className="truncate text-xs text-slate-500">{app.developer}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <RatingStars rating={app.rating} size={14} showValue />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
