import { useState } from 'react';
import { Menu, X, Smartphone, Heart, LogIn, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';

const links = [
  { label: 'Discover', to: '/' },
  { label: 'Categories', to: '/?view=categories' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const { route, navigate } = useRouter();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <button onClick={() => go('/')} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Smartphone className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            App<span className="text-brand-600">Finder</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => go(link.to)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                route.path === link.to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => go('/')} className="btn-ghost">
            <Search className="h-4 w-4" />
            Search
          </button>
          {user ? (
            <>
              <button onClick={() => go('/favorites')} className="btn-secondary">
                <Heart className="h-4 w-4" />
                Favorites
              </button>
              <button onClick={() => signOut()} className="btn-ghost">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => go('/auth')} className="btn-primary">
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <button
                key={link.to}
                onClick={() => go(link.to)}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  route.path === link.to ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user ? (
              <>
                <button onClick={() => go('/favorites')} className="btn-secondary mt-2 w-full">
                  <Heart className="h-4 w-4" />
                  Favorites
                </button>
                <button onClick={() => signOut()} className="btn-ghost w-full">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => go('/auth')} className="btn-primary mt-2 w-full">
                <LogIn className="h-4 w-4" />
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
