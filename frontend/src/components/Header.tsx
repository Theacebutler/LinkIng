import { useAuths } from "../hooks/useAuths";
import Announcment from "./Annououncement";
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const Wordmark = () => (
  <div className="flex items-center gap-2.5">
    <MobileLogo />
    <span className="text-base font-semibold text-text tracking-tight">Linking</span>
  </div>
);

export function Header({ isPopupOpen: isOpen, setIsPopupOpen: setIsOpen }: { isPopupOpen: boolean; setIsPopupOpen: (isOpen: boolean) => void }) {
  const { isLogin } = useAuths()
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md ">
      <div className="max-w-350 mx-auto flex  justify-between items-center gap-3 px-4 md:px-6 py-3">
        <div>
          <Wordmark />
        </div>
        <div className="hidden md:block flex-1 min-w-0">
          <Announcment />
        </div>
        {
          isLogin ?
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-text-soft hover:text-text hover:bg-surface transition-colors"
              aria-label="Toggle details"
            >
              {isOpen ? <CloseIcon /> : <DetailsIcon />}
            </button> : null
        }
      </div>
    </header>
  );
}
