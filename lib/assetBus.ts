type Listener = (name: string) => void;

const listeners = new Set<Listener>();

export const assetBus = {
  notify(name: string) {
    // normalize
    const n = String(name);
    listeners.forEach((l) => l(n));
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export default assetBus;
