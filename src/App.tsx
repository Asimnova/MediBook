import { AuthProvider } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiscoverPage from '@/pages/DiscoverPage';
import AppDetailPage from '@/pages/AppDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import AuthPage from '@/pages/AuthPage';
import AboutPage from '@/pages/AboutPage';

function Routes() {
  const { route } = useRouter();
  const { path } = route;

  let page: React.ReactNode;
  switch (true) {
    case path === '/':
      page = <DiscoverPage />;
      break;
    case path.startsWith('/app/'):
      page = <AppDetailPage id={path.split('/')[2]} />;
      break;
    case path === '/favorites':
      page = <FavoritesPage />;
      break;
    case path === '/auth':
      page = <AuthPage />;
      break;
    case path === '/about':
      page = <AboutPage />;
      break;
    default:
      page = <DiscoverPage />;
  }

  return <div className="flex min-h-screen flex-col">{page}</div>;
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1">
        <Routes />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
