import { Navigate } from 'react-router-dom';
import { AddResourceForm } from '../components/AddResourceForm';
import { ResourceList } from '../components/ResourceList';
import { KeyAndOwner } from '../components/KeyAndOwner';
import Aside from '../components/Aside';

interface DashboardProps {
  isLogin: boolean;
  resources: import('../types/resource').Resource[];
  loading: boolean;
  domainFilter: string | null;
  tagFilter: string | null;
  showKeyAndOwner: boolean;
  isPopupOpen: boolean;
  addedThisWeek: number;
  onAddResource: (data: { title: string; resourceUrl: string; sourceUrl: string; tags: string[] }) => Promise<boolean>;
  onDeleteResource: (id: string) => Promise<boolean>;
  onUpdateResource: (id: string, data: { title: string; sourceUrl: string; tags?: string[] }) => Promise<boolean>;
  onTagFilter: (tag: string | null) => void;
  onDomainFilter: (domain: string | null) => void;
  onClearDomainFilter: () => void;
  onClearTagFilter: () => void;
  setShowKeyAndOwner: (v: boolean) => void;
  setIsPopupOpen: (v: boolean) => void;
}

export default function Dashboard(props: DashboardProps) {
  if (!props.isLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
      <div className="space-y-5">
        <AddResourceForm onSubmit={props.onAddResource} />
        <ResourceList
          resources={props.resources}
          onDelete={props.onDeleteResource}
          onUpdate={props.onUpdateResource}
          loading={props.loading}
          domainFilter={props.domainFilter}
          onClearDomainFilter={props.onClearDomainFilter}
          tagFilter={props.tagFilter}
          handleTagFilter={props.onTagFilter}
          onClearTagFilter={props.onClearTagFilter}
        />
      </div>
      {props.isPopupOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 xl:hidden animate-fade-in"
          onClick={() => props.setIsPopupOpen(false)}
        />
      )}
      <Aside
        setIsPopupOpen={props.setIsPopupOpen}
        isOpen={props.isPopupOpen}
        resources={props.resources}
        setDomainFilter={props.onDomainFilter as (d: string | null) => void}
        addedThisWeek={props.addedThisWeek}
        domainFilter={props.domainFilter}
        tagFilter={props.tagFilter}
        handleTagFilter={props.onTagFilter}
        showKeyAndOwner={props.showKeyAndOwner}
        setShowKeyAndOwner={props.setShowKeyAndOwner}
        handleDomainFilter={props.onDomainFilter as (d: string | null) => void}
      />
      {props.showKeyAndOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <KeyAndOwner setShowKeyAndOwner={props.setShowKeyAndOwner} />
        </div>
      )}
    </div>
  );
}
