import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  tags?: string[];
  source: 'markdown' | 'json'; // Track the source of the post
  featured?: boolean; // Whether this post is featured
  priority?: number; // Priority score for hero selection (1-10)
  category?: string; // Main category for this post
};
