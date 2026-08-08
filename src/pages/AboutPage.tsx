import { Smartphone, ShieldCheck, Users, Target, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from '@/lib/router';

const values = [
  { icon: ShieldCheck, title: 'Curated Quality', desc: 'Every app is reviewed and categorized by our team before listing.' },
  { icon: Users, title: 'Community Driven', desc: 'Real user reviews and ratings help you make informed decisions.' },
  { icon: Target, title: 'Personalized', desc: 'Save favorites and get recommendations tailored to your taste.' },
  { icon: Sparkles, title: 'Always Fresh', desc: 'We constantly update our directory with the latest and greatest apps.' },
];

export default function AboutPage() {
  const { navigate } = useRouter();

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-page text-center">
          <span className="chip bg-brand-100 text-brand-700">
            <Smartphone className="h-3.5 w-3.5" />
            Our mission
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Helping you find apps worth downloading
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            AppFinder is a curated directory of the best mobile apps across every category — from productivity to games, fitness to finance.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-12 text-center text-white shadow-lift">
          <h2 className="font-display text-3xl font-bold">Ready to discover your next favorite app?</h2>
          <p className="mx-auto mt-2 max-w-md text-brand-50">
            Join thousands of users who trust AppFinder to find great apps.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-soft transition-transform hover:scale-105"
          >
            Start exploring
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
