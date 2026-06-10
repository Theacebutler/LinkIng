import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';
import LoginOrReg from './components/LoginOrReg';
import Footer from './components/Footer';
import { Toast } from './components/Toast';
import { KeyAndOwner } from './components/KeyAndOwner';
import Aside from './components/Aside';
import InDevAlert from './components/inDevAlert';

import { useToast } from './hooks/useToast';
import { useAuths } from './hooks/useAuths';
import { useResources } from './hooks/useResources';


function App() {
  const { isLogin } = useAuths();
  const { resources, loading, addResource, updateResource, deleteResource } = useResources();
  const { toast, setToast } = useToast();
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showKeyAndOwner, setShowKeyAndOwner] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string; tags: string[] }) => {
    return await addResource(data);
  };

  const handleTagFilter = (tag: string | null) => {
    setIsPopupOpen(false);
    setTagFilter(tag);
  };

  const handleDomainFilter = (domainFilter: string | null) => {
    setIsPopupOpen(false);
    setDomainFilter(domainFilter);
  };

  const addedThisWeek = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- timestamp intentionally captures current time on render
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return resources.filter((r) => new Date(r.createdAt).getTime() >= weekAgo).length;
  }, [resources]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      <div className="block md:hidden">
        <InDevAlert />
      </div>
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
                  tagFilter={tagFilter}
                  handleTagFilter={handleTagFilter}
                  onClearTagFilter={() => setTagFilter(null)}
                />
              </div>
              {isPopupOpen && (
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 xl:hidden animate-fade-in"
                  onClick={() => setIsPopupOpen(false)}
                />
              )}
              <Aside
                setIsPopupOpen={setIsPopupOpen}
                isOpen={isPopupOpen}
                resources={resources}
                setDomainFilter={setDomainFilter}
                addedThisWeek={addedThisWeek}
                domainFilter={domainFilter}
                showKeyAndOwner={showKeyAndOwner}
                setShowKeyAndOwner={setShowKeyAndOwner}
                handleDomainFilter={handleDomainFilter}
                handleTagFilter={handleTagFilter}
                tagFilter={tagFilter}
              />
              {showKeyAndOwner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <KeyAndOwner setShowKeyAndOwner={setShowKeyAndOwner} />
                </div>
              )}
            </div>
          ) : (
            <LoginOrReg />
          )}
        </div>
      </main >

      <Footer />
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />
    </div >
  );
}

export default App;
