import { useState, useEffect } from 'react';

let globalKey: string | null = null;
let globalOwner: string | null = null;
const listeners = new Set<(state: { key: string | null; owner: string | null }) => void>();

function setGlobalState(newKey: string | null, newOwner: string | null) {
  globalKey = newKey;
  globalOwner = newOwner;
  listeners.forEach((listener) => listener({ key: globalKey, owner: globalOwner }));
}

export function useKeyAndOwner() {
  const [state, setState] = useState({ key: globalKey, owner: globalOwner });

  useEffect(() => {
    const listener = (newState: { key: string | null; owner: string | null }) => {
      setState(newState);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setKey = (k: string | null) => setGlobalState(k, globalOwner);
  const setOwner = (o: string | null) => setGlobalState(globalKey, o);

  return {
    key: state.key,
    owner: state.owner,
    setKey,
    setOwner,
  };
}

