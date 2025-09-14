export interface ArticleData {
  // Required fields
  articleName: string;
  articleText: string;
  
  // Optional fields with fallbacks
  articleCoverPhoto?: string | null;
  author?: string;
  authorImage?: string | null;
  articleTags?: string[];
  featured?: boolean;
  priority?: number;
  category?: string;
  
  // Auto-generated fields (will be set by the system)
  slug?: string;
  date?: string;
  excerpt?: string;
}

export interface ProcessedArticle extends ArticleData {
  // These will always be present after processing
  slug: string;
  date: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorImage: string;
  tags: string[];
}
