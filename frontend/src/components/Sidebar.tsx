import { useEffect, useState } from 'react';
import { useAuths } from '../hooks/useAuths';
import { config } from '../../config';
import Cookies from 'js-cookie';

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const Logo = ({ idSuffix = '' }: { idSuffix?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect width="32" height="32" rx="9" fill={`url(#logo-gradient${idSuffix})`} />
    <path
      d="M13.5 18.5l5-5m-2-2a3.5 3.5 0 0 1 5 5l-2 2a3.5 3.5 0 0 1-5-5m-4 4a3.5 3.5 0 0 1-5-5l2-2a3.5 3.5 0 0 1 5 5"
      stroke="#0b0b10"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id={`logo-gradient${idSuffix}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c4b5fd" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

export function Sidebar() {
  const { setIsLogin } = useAuths();
  const [active, setActive] = useState<'home' | 'search' | 'add'>('home');

  useEffect(() => {
    const onScroll = () => {
      const addSection = document.getElementById('add-resource');
      if (!addSection) return;
      const rect = addSection.getBoundingClientRect();
      if (rect.top < 200 && rect.bottom > 100) {
        setActive('add');
      } else {
        setActive('home');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    Cookies.remove(config.ACCESS_TOKEN_KEY_NAME);
    Cookies.remove(config.REFRESH_TOKEN_KEY_NAME);
    setIsLogin(false);
    window.location.reload();
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 lg:w-20 flex-col items-center border-r border-border bg-bg py-5 z-40">
      <div className="mb-6">
        <Logo idSuffix="-sidebar" />
      </div>

      <nav className="flex-1 flex flex-col items-center gap-2 w-full px-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`icon-btn w-11 h-11 lg:w-12 lg:h-12 ${
            active === 'home' ? 'bg-surface text-text' : ''
          }`}
          aria-label="Home"
          title="Home"
        >
          <HomeIcon active={active === 'home'} />
        </button>
        <button
          onClick={() => scrollTo('resources-section')}
          className={`icon-btn w-11 h-11 lg:w-12 lg:h-12 ${
            active === 'search' ? 'bg-surface text-text' : ''
          }`}
          aria-label="Search resources"
          title="Search"
        >
          <SearchIcon />
        </button>
        <button
          onClick={() => scrollTo('add-resource')}
          className={`mt-3 inline-flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-primary text-bg hover:bg-primary-hover transition-colors`}
          aria-label="Add resource"
          title="Add resource"
        >
          <PlusIcon />
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="icon-btn mb-2"
        aria-label="Log out"
        title="Log out"
      >
        <LogoutIcon />
      </button>
    </aside>
  );
}
