import { useResources } from './hooks/useResources';
import { Header } from './components/Header';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceList } from './components/ResourceList';

function App() {
  const { resources, loading, addResource, deleteResource } = useResources();

  const handleAddResource = async (data: { title: string; resourceUrl: string; sourceUrl: string }) => {
    return await addResource(data);
  };

  return (
    <>
      <Header />
      <main>
        <AddResourceForm onSubmit={handleAddResource} />
        <ResourceList
          resources={resources}
          onDelete={deleteResource}
          loading={loading}
        />
      </main>
      <footer className="text-center py-4 text-slate-400 text-sm">
        {resources.length > 0 && (
          <p>{resources.length} resource{resources.length !== 1 ? 's' : ''} saved</p>
        )}
      </footer>
    </>
  );
}

export default App;
