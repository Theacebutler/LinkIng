import { useResources } from './hooks/useResources';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';
import LoginOrReg from './components/LoginOrReg';
import { useAuths } from './hooks/useAuths';
import Footer from './components/Footer';

function App() {
  const { resources, loading, addResource, updateResource, deleteResource } = useResources();
  const { isLogin } = useAuths();
  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string, owner: string }) => {
    return await addResource(data);
  };


  return (
    <>
      <Header />
      {
        isLogin ?
          <>
            <main>
              <AddResourceForm onSubmit={handleAddResource} />
              <ResourceList
                resources={resources}
                onDelete={deleteResource}
                onUpdate={updateResource}
                loading={loading}
              />
            </main >
            <footer className="text-center py-4 text-slate-400 text-sm">
              {resources.length > 0 && (
                <p>{resources.length} resource{resources.length !== 1 ? 's' : ''} saved</p>
              )}
            </footer>
          </>
          :
          <LoginOrReg />
      }
      <Footer />
    </>
  );
}

export default App;
