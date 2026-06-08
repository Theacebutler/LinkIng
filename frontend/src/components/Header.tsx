const DetailsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M4 6h16M4 12h12M4 18h6" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 6L6 18M6 6l12 12" />
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

const Wordmark = () => (
  <div className="flex items-center gap-2.5">
    <MobileLogo />
    <span className="text-base font-semibold text-text tracking-tight">Linking</span>
  </div>
);

export function Header({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border">
      <div className="max-w-350 mx-auto flex justify-between items-center gap-3 px-4 md:px-6 py-3">
        <div>
          <Wordmark />
        </div>
        <div className="">
          <button
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <CloseIcon /> : <DetailsIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
