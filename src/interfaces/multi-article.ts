import { ArticleData } from "./article";

// Simple multi-article file - just an array of articles
export type MultiArticleFile = ArticleData[];

export interface ProcessedArticleData extends ArticleData {
  // These will always be present after processing
  slug: string;
  date: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorImage: string;
  tags: string[];
  category: string;
  featured: boolean;
  priority: number;
}
