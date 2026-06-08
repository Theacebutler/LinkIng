import { useMemo, useState } from 'react';
import { useResources } from './hooks/useResources';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';
import { Domains } from './components/Domains';
import LoginOrReg from './components/LoginOrReg';
import { useAuths } from './hooks/useAuths';
import Footer from './components/Footer';
import { GetUserKey } from './components/GetUserKey';

function App() {
  const { resources, loading, addResource, updateResource, deleteResource } = useResources();
  const { isLogin } = useAuths();
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string; owner: string }) => {
    return await addResource(data);
  };
  const handleDomainFilter = (domainFilter: string | null) => {
    setIsOpen(false);
    setDomainFilter(domainFilter);
  };
  const addedThisWeek = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- timestamp intentionally captures current time on render
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return resources.filter((r) => new Date(r.createdAt).getTime() >= weekAgo).length;
  }, [resources]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="flex-1 md:pl-16 lg:pl-20">
        <div className="max-w-350 mx-auto px-4 md:px-6 py-5 md:py-6">
          {isLogin ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
              <div className="space-y-5">
                <AddResourceForm onSubmit={handleAddResource} />
                <ResourceList
                  resources={resources}
                  onDelete={deleteResource}
                  onUpdate={updateResource}
                  loading={loading}
                  domainFilter={domainFilter}
                  onClearDomainFilter={() => setDomainFilter(null)}
                />
              </div>
              {/* Backdrop for mobile drawer */}
              {isOpen && (
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 xl:hidden animate-fade-in"
                  onClick={() => setIsOpen(false)}
                />
              )}

              <aside
                className={`fixed inset-y-0 right-0 z-40 w-full max-w-[320px] bg-bg border-l border-border p-6 shadow-2xl flex flex-col space-y-4 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                  } xl:static xl:translate-x-0 xl:opacity-100 xl:pointer-events-auto xl:w-auto xl:max-w-none xl:bg-transparent xl:border-none xl:p-0 xl:shadow-none xl:z-0 xl:overflow-visible`}
              >
                <div className="flex items-center justify-between xl:hidden pb-4 border-b border-border">
                  <span className="font-semibold text-text">More Options</span>
                  <button
                    onClick={() => setIsOpen(false)}
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

                <div className="card p-5">
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

                <Domains
                  resources={resources}
                  activeDomain={domainFilter}
                  onSelect={handleDomainFilter}
                />
                <GetUserKey />
              </aside>
            </div>
          ) : (
            <LoginOrReg />
          )}
        </div>
      </main >

      <Footer />
    </div >
  );
}

export default App;
