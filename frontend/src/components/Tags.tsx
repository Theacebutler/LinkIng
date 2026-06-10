import { useMemo } from "react";
import type { Resource } from "../types/resource";

interface TagsProps {
  resources: Resource[];
  tagFilter: string | null;
  onSelect: (domain: string | null) => void;
}

export function Tags({ resources, tagFilter, onSelect }: TagsProps) {
  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of resources) {
      for (const tag of r.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [resources]);

  if (tags.length === 0) return null;

  return (
    <div className="card p-4 border border-border-strong border-opacity-10 hover:border-primary-hover">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-text">Your Tags</h3>
        {tagFilter && (
          <button
            onClick={() => onSelect(null)}
            className="text-[11px] text-text-soft hover:text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-0.5 max-h-80 overflow-y-auto">
        {tags.map(([tag, count]) => {
          const active = tagFilter === tag;
          return (
            <li key={tag}>
              <button
                onClick={() => onSelect(active ? null : tag)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${active
                  ? 'bg-primary-soft text-black'
                  : 'text-text-soft hover:bg-surface hover:text-text'
                  }`}
              >
                <span className="flex-1 min-w-0 text-xs truncate">{tag.startsWith('#') ? tag : `#${tag}`}</span>
                <span
                  className={`text-[11px] font-medium tabular-nums ${active ? 'text-primary' : 'text-muted'
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
