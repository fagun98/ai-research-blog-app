"use client";

import { useMemo } from "react";
import cn from "classnames";

type TagFilterProps = {
  availableTags: string[];
  selectedTags: string[];
  onChange: (next: string[]) => void;
  className?: string;
};

export function TagFilter({ availableTags, selectedTags, onChange, className }: TagFilterProps) {
  const sortedTags = useMemo(() => {
    return [...new Set(availableTags)].sort((a, b) => a.localeCompare(b));
  }, [availableTags]);

  function toggle(tag: string) {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  }

  function clearAll() {
    onChange([]);
  }

  if (sortedTags.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">Filter by tags</h3>
        <div className="flex items-center gap-3">
          {selectedTags.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedTags.length} selected
            </span>
          )}
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              "text-sm px-3 py-1.5 rounded-md border",
              selectedTags.length === 0
                ? "text-gray-400 border-gray-200 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800/50"
            )}
            disabled={selectedTags.length === 0}
            aria-label="Clear selected tags"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-transparent dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800/60"
              )}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}


