import { useMemo } from 'react';
import type { Resource } from '../types/resource';

interface DomainsProps {
  resources: Resource[];
  activeDomain: string | null;
  onSelect: (domain: string | null) => void;
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const getInitials = (s: string) => {
  if (!s) return '?';
  const cleaned = s.replace(/\..*$/, '');
  return cleaned.slice(0, 2).toUpperCase();
};

export function Domains({ resources, activeDomain, onSelect }: DomainsProps) {
  const domains = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of resources) {
      const host = getHostname(r.resourceUrl);
      if (host) map.set(host, (map.get(host) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [resources]);

  if (domains.length === 0) return null;

  return (
    <div className="card p-4 border border-border-strong border-opacity-10 hover:border-primary-hover">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-text">Quick access</h3>
        {activeDomain && (
          <button
            onClick={() => onSelect(null)}
            className="text-[11px] text-text-soft hover:text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-0.5 max-h-80 overflow-y-auto">
        {domains.map(([domain, count]) => {
          const active = activeDomain === domain;
          return (
            <li key={domain}>
              <button
                onClick={() => onSelect(active ? null : domain)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${active
                  ? 'bg-primary-soft text-bg'
                  : 'text-text-soft hover:bg-surface hover:text-text'
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                    active
                      ? 'bg-primary text-bg'
                      : 'bg-surface text-text-soft border border-border'
                  }`}
                >
                  {getInitials(domain)}
                </span>
                <span className="flex-1 min-w-0 text-xs truncate">{domain}</span>
                <span
                  className={`text-[11px] font-medium tabular-nums ${
                    active ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
