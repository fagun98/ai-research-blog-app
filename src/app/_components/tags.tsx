import cn from "classnames";

interface TagsProps {
  tags: string[];
  className?: string;
}

export function Tags({ tags, className }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 mb-4", className)}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
            "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
            "text-blue-700 dark:text-blue-300",
            "border border-blue-200 dark:border-blue-700/50",
            "transition-all duration-200 ease-in-out",
            "hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/30",
            "hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100",
            "dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30",
            "hover:border-blue-300 dark:hover:border-blue-600/70",
            "cursor-default select-none"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
