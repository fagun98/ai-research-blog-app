"use client";

import { useMemo, useState } from "react";
import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";
import { TagFilter } from "./tag-filter";

type Props = {
  posts: Post[];
};

export function FilteredStories({ posts }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => t && tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return posts;
    return posts.filter(p => {
      const tags = p.tags || [];
      return selectedTags.every(tag => tags.includes(tag));
    });
  }, [posts, selectedTags]);

  return (
    <section>
      <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        Latest Articles
      </h2>

      <TagFilter
        availableTags={allTags}
        selectedTags={selectedTags}
        onChange={setSelectedTags}
        className="mb-6"
      />

      <div className="space-y-0 mb-16">
        {filtered.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            tags={post.tags}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-slate-500 dark:text-slate-400 text-sm py-8">
            No articles match the selected tags.
          </div>
        )}
      </div>
    </section>
  );
}


