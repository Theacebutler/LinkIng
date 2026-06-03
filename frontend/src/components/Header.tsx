import { useAuths } from '../hooks/useAuths';
import Cookies from 'js-cookie';

const StreakIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14 3s1 2 1 5-1 5-3 7 0 6 3 6 6-3 6-7-3-6-4-9-3-2-3-2z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2l1.7 4.6L18 8l-4.3 1.4L12 14l-1.7-4.6L6 8l4.3-1.4z" />
  </svg>
);

const MobileLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect width="32" height="32" rx="9" fill="url(#logo-gradient-header)" />
    <path
      d="M13.5 18.5l5-5m-2-2a3.5 3.5 0 0 1 5 5l-2 2a3.5 3.5 0 0 1-5-5m-4 4a3.5 3.5 0 0 1-5-5l2-2a3.5 3.5 0 0 1 5 5"
      stroke="#0b0b10"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="logo-gradient-header" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c4b5fd" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

export function Header() {
  const { isLogin } = useAuths();
  const name = Cookies.get('name') || '';

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto flex items-center gap-3 px-4 md:px-6 py-3">
        <div className="flex items-center gap-2.5 md:ml-12 lg:ml-16">
          <div className="md:hidden flex items-center gap-2">
            <MobileLogo />
            <span className="text-base font-semibold text-text">Linking</span>
          </div>
        </div>

        <div className="flex-1" />

        {isLogin ? (
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5 mr-2 px-2.5 py-1.5 rounded-full bg-surface border border-border text-xs text-text-soft">
              <StreakIcon />
              <span className="text-text font-medium">0</span>
            </div>
            <button className="icon-btn relative" aria-label="Notifications" title="Notifications">
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="ml-2 flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-surface border border-border">
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
                  <SparkIcon />
                </span>
                <span className="text-text font-medium">0</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-bg text-sm font-semibold">
                {name ? name[0].toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-text-soft">
            <span className="hidden sm:inline">Not signed in</span>
          </div>
        )}
      </div>
    </header>
  );
}
