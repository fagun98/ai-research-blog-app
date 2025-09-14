"use client";

import { useState } from "react";
import cn from "classnames";

interface LoadMoreProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

export function LoadMore({ onLoadMore, hasMore, loading = false }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-12 mb-16">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className={cn(
          "px-8 py-3 rounded-lg font-medium transition-all duration-200",
          "border border-slate-300 dark:border-slate-600",
          "text-slate-700 dark:text-slate-300",
          "hover:bg-slate-50 dark:hover:bg-slate-800",
          "hover:border-slate-400 dark:hover:border-slate-500",
          "hover:shadow-md",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Load More Articles"
        )}
      </button>
    </div>
  );
}
