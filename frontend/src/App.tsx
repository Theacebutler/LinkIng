import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Footer from './components/Footer';
import { Toast } from './components/Toast';
import Announcement from './components/Annououncement';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

import { useToast } from './hooks/useToast';
import { useAuths } from './hooks/useAuths';
import { useResources } from './hooks/useResources';
import { handleGoogleCallback } from "./utils/authHelpers";

function App() {
  const { isLogin, setIsLogin } = useAuths();
  const { refetch, resources, loading, addResource, updateResource, deleteResource } = useResources();
  const { toast, setToast } = useToast();
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [showKeyAndOwner, setShowKeyAndOwner] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    handleGoogleCallback()
      .then(async ok => {
        if (ok) {
          await refetch()
          setIsLogin(true)
        }
      })
      .catch(err => {
        console.error("Error in handleGoogleCallback", err)
      })
  })

  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string; tags: string[] }) => {
    return await addResource(data);
  };

  const handleTagFilter = (tagFilter: string | null) => {
    setIsPopupOpen(false);
    setTagFilter(tagFilter);
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
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
        <div className="block md:hidden">
          <Announcement />
        </div>
        <main className="flex-1 md:px-12 lg:px-20">
          <div className="max-w-full mx-auto px-4 md:px-6 py-5 md:py-6">
            <Routes>
              <Route path="/" element={<Landing isLogin={isLogin} />} />
              <Route path="/login" element={<LoginPage isLogin={isLogin} />} />
              <Route path="/dashboard" element={
                <Dashboard
                  isLogin={isLogin}
                  resources={resources}
                  loading={loading}
                  domainFilter={domainFilter}
                  tagFilter={tagFilter}
                  showKeyAndOwner={showKeyAndOwner}
                  isPopupOpen={isPopupOpen}
                  addedThisWeek={addedThisWeek}
                  onAddResource={handleAddResource}
                  onDeleteResource={deleteResource}
                  onUpdateResource={updateResource}
                  onTagFilter={handleTagFilter}
                  onDomainFilter={handleDomainFilter}
                  onClearDomainFilter={() => setDomainFilter(null)}
                  onClearTagFilter={() => setTagFilter(null)}
                  setShowKeyAndOwner={setShowKeyAndOwner}
                  setIsPopupOpen={setIsPopupOpen}
                />
              } />
              <Route path="*" element={<Landing isLogin={isLogin} />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <Toast
          message={toast?.message || ''}
          type={toast?.type || 'success'}
          onClose={() => setToast(null)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
