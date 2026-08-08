import { Smartphone, Mail, Twitter, Github, Linkedin } from 'lucide-react';
import { useRouter } from '@/lib/router';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Discover', to: '/' },
      { label: 'Categories', to: '/?view=categories' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', to: '/auth' },
      { label: 'Favorites', to: '/favorites' },
    ],
  },
];

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Smartphone className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold text-slate-900">
                App<span className="text-brand-600">Finder</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Discover, compare, and save the best mobile apps across every category — all in one place.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.to)}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-500" /> hello@appfinder.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} AppFinder. All rights reserved.</p>
          <div className="flex gap-5">
            <button className="hover:text-brand-600">Privacy</button>
            <button className="hover:text-brand-600">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
