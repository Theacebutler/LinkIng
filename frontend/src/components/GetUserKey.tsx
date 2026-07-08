import { useKeyAndOwner } from '../hooks/useKeyAndOwner';
import { getUserKey } from '../utils/authHelpers';
import { useToast } from '../hooks/useToast';

interface GetUserKeyProps {
  setIsOpen: (isOpen: boolean) => void;
  setShowKeyAndOwner: (show: boolean) => void;
}

export function GetUserKey({ setIsOpen, setShowKeyAndOwner }: GetUserKeyProps) {
  const { showToast } = useToast();
  const { setKey, setOwner } = useKeyAndOwner();
  function handleClick() {
    setIsOpen(false);
    getUserKey()
      .then((data) => {
        setKey(data.key);
        setOwner(data.owner);
        setShowKeyAndOwner(true);
      })
      .catch((e) => {
        showToast('Failed to get your API key', 'error');
        console.log("Error attempting to get API key", e);
      });
  }



  return (
    <>
      <div className="card p-4 border border-border-strong border-opacity-10 hover:border-primary-hover">
        <h3 className="text-sm font-semibold text-text mb-3">Get your API key</h3>
        <p className="text-xs text-text-soft mb-3">
          Get your API key to use with Apple Shortcuts
        </p>
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-text-soft transition-colors hover:bg-primary hover:text-text bg-surface/50 border border-border/60"
        >
          Get
        </button>
      </div>
    </>
  );
}
