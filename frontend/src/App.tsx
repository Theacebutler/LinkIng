import { useMemo, useState } from 'react';
import { useResources } from './hooks/useResources';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';
import { Domains } from './components/Domains';
import LoginOrReg from './components/LoginOrReg';
import { useAuths } from './hooks/useAuths';
import Footer from './components/Footer';

function App() {
  const { resources, loading, addResource, updateResource, deleteResource } = useResources();
  const { isLogin } = useAuths();
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string; owner: string }) => {
    return await addResource(data);
  };

  const addedThisWeek = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- timestamp intentionally captures current time on render
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return resources.filter((r) => new Date(r.createdAt).getTime() >= weekAgo).length;
  }, [resources]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

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
              <aside className="hidden xl:block space-y-4">
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
                  onSelect={setDomainFilter}
                />
              </aside>
            </div>
          ) : (
            <LoginOrReg />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
