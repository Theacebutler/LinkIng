import { useResources } from './hooks/useResources';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';
import AddUser from './components/AddUser';
import { TopBar } from './components/TopBar';
import InDevAlert from './components/inDevAlert';
import { useAuths } from './hooks/useAuths';

function App() {
  const { resources, loading, addResource, deleteResource } = useResources();
  const { isLogin } = useAuths();
  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string, owner: string }) => {
    return await addResource(data);
  };


  return (
    <>
      <InDevAlert />
      {
        isLogin ?
          <TopBar /> :
          null
      }
      <Header />
      {
        isLogin ?
          <>
            <main>
              <AddResourceForm onSubmit={handleAddResource} />
              <ResourceList
                resources={resources}
                onDelete={deleteResource}
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
          <AddUser />
      }
    </>
  );
}

export default App;
