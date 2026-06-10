import { useKeyAndOwner } from "../hooks/useKeyAndOwner";
import type { Resource } from "../types/resource";
import { Domains } from "./Domains";
import { Tags } from "./Tags";
import { GetUserKey } from "./GetUserKey";
interface AsideProps {
  setIsPopupOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  resources: Resource[];
  addedThisWeek: number;
  domainFilter: string | null;
  tagFilter: string | null;
  showKeyAndOwner: boolean;
  setDomainFilter: (domainFilter: string | null) => void;
  setShowKeyAndOwner: (showKeyAndOwner: boolean) => void;
  handleDomainFilter: (domainFilter: string | null) => void;
  handleTagFilter: (tagFilter: string | null) => void;
}
export default function Aside({
  setIsPopupOpen: setIsOpen,
  isOpen,
  resources,
  addedThisWeek,
  domainFilter,
  tagFilter,
  handleDomainFilter,
  handleTagFilter,
  setShowKeyAndOwner
}: AsideProps) {
  const { setKey, setOwner } = useKeyAndOwner();
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 w-full max-w-[320px] bg-bg border-l border-border p-6 shadow-2xl flex flex-col space-y-4 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } xl:static xl:translate-x-0 xl:opacity-100 xl:pointer-events-auto xl:w-auto xl:max-w-none xl:bg-transparent xl:border-none xl:p-0 xl:shadow-none xl:z-0 xl:overflow-visible`}
    >
      <div className="flex items-center justify-between xl:hidden pb-4 border-b border-border">
        <span className="font-semibold text-text">More Options</span>
        <button
          onClick={() => {
            setKey(null);
            setOwner(null);
            setIsOpen(false);
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-soft hover:text-text hover:bg-surface transition-colors"
          aria-label="Close details"
        >
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
        </button>
      </div>

      <div className="card p-4 border border-border-strong border-opacity-10 hover:border-primary-hover">
        <h3 className="text-sm font-semibold text-text mb-3">At a glance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-soft">Total saved</span>
            <span className="font-semibold text-text">{resources.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-soft">Added this week</span>
            <span className="font-semibold text-text">{addedThisWeek}</span>
          </div>
        </div>
      </div>

      <Tags
        resources={resources}
        tagFilter={tagFilter}
        onSelect={handleTagFilter}
      />
      <Domains
        resources={resources}
        activeDomain={domainFilter}
        onSelect={handleDomainFilter}
      />
      <Tags
        resources={resources}
        tagFilter={tagFilter}
        onSelect={handleTagFilter}
      />
      <GetUserKey setIsOpen={setIsOpen} setShowKeyAndOwner={setShowKeyAndOwner} />
    </aside >
  )
}
