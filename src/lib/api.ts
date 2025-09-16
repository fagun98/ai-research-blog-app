import { Post } from "@/interfaces/post";
import { ArticleData, ProcessedArticle } from "@/interfaces/article";
import { MultiArticleFile, ProcessedArticleData } from "@/interfaces/multi-article";
import { BRAND_CONFIG } from "@/lib/constants";
import { selectHeroPost } from "@/lib/hero-selection";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");
const articlesDirectory = join(process.cwd(), "_articles");

// Helper function to generate slug from title
function generateSlug(title: string): string {
  if (!title || typeof title !== 'string') {
    console.warn('generateSlug received invalid title:', title);
    return 'untitled-article';
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 160): string {
  if (!content || typeof content !== 'string') {
    console.warn('generateExcerpt received invalid content:', content);
    return 'No content available';
  }
  const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText;
}

// Helper function to process JSON article data
function processArticleData(articleData: ArticleData, filename: string): ProcessedArticle {
  // Validate required fields
  if (!articleData || !articleData.articleName || !articleData.articleText) {
    console.error('Invalid article data in file:', filename, articleData);
    throw new Error(`Invalid article data in file ${filename}: missing required fields`);
  }

  const slug = generateSlug(articleData.articleName);
  const date = new Date().toISOString();
  const excerpt = generateExcerpt(articleData.articleText);
  
  // Determine main category from tags
  const mainCategory = articleData.articleTags?.[0] || 'General AI';
  
  return {
    ...articleData,
    slug,
    date,
    excerpt,
    coverImage: articleData.articleCoverPhoto || '/assets/blog/default-cover.jpg',
    author: articleData.author || BRAND_CONFIG.author.name,
    authorImage: articleData.authorImage || BRAND_CONFIG.author.picture,
    tags: articleData.articleTags || ['AI'],
    category: mainCategory,
    featured: articleData.articleTags?.includes('Featured') || false,
    priority: articleData.articleTags?.includes('High Priority') ? 8 : 5
  };
}

// Helper function to process multi-article data (simple array)
function processMultiArticleData(multiArticleData: MultiArticleFile): ProcessedArticleData[] {
  if (!Array.isArray(multiArticleData)) {
    console.error('Invalid multi-article data: expected array, got', typeof multiArticleData);
    return [];
  }

  return multiArticleData
    .filter(articleData => {
      // Filter out invalid articles
      if (!articleData || !articleData.articleName || !articleData.articleText) {
        console.warn('Skipping invalid article:', articleData);
        return false;
      }
      return true;
    })
    .map(articleData => {
      const slug = generateSlug(articleData.articleName);
      const date = articleData.date || new Date().toISOString();
      const excerpt = generateExcerpt(articleData.articleText);
      
      // Determine main category from tags
      const mainCategory = articleData.articleTags?.[0] || 'General AI';
      
      return {
        ...articleData,
        slug,
        date,
        excerpt,
        coverImage: articleData.articleCoverPhoto || '/assets/blog/default-cover.jpg',
        author: articleData.author || BRAND_CONFIG.author.name,
        authorImage: articleData.authorImage || BRAND_CONFIG.author.picture,
        tags: articleData.articleTags || ['AI'],
        category: mainCategory,
        featured: articleData.featured || articleData.articleTags?.includes('Featured') || false,
        priority: articleData.priority || (articleData.articleTags?.includes('High Priority') ? 8 : 5)
      };
    });
}

// Legacy Markdown posts functions
export function getPostSlugs() {
  const markdownSlugs = fs.existsSync(postsDirectory) 
    ? fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'))
    : [];
  const jsonSlugs = fs.existsSync(articlesDirectory)
    ? fs.readdirSync(articlesDirectory).filter(file => file.endsWith('.json'))
        .map(file => generateSlug(file.replace('.json', '')))
    : [];
  
  return [...markdownSlugs, ...jsonSlugs];
}

export function getPostBySlug(slug: string) {
  // First try to find in markdown posts
  const markdownPath = join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(markdownPath)) {
    const fileContents = fs.readFileSync(markdownPath, "utf8");
    const { data, content } = matter(fileContents);
        return { 
          ...data, 
          slug, 
          content, 
          source: 'markdown' as const,
          tags: data.tags || [],
          featured: data.featured || false,
          priority: data.priority || 5,
          category: data.category || (data.tags?.[0] || 'General AI')
        } as Post;
  }

  // Then try to find in JSON articles (both single and multi-article files)
  const jsonFiles = fs.existsSync(articlesDirectory) 
    ? fs.readdirSync(articlesDirectory).filter(file => file.endsWith('.json'))
    : [];
  
  for (const filename of jsonFiles) {
    try {
      const jsonPath = join(articlesDirectory, filename);
      const fileContents = fs.readFileSync(jsonPath, "utf8");
      const jsonData = JSON.parse(fileContents);
      
      // Check if it's a multi-article file (array of articles)
      if (Array.isArray(jsonData)) {
        // Multi-article file - simple array
        const multiArticleData: MultiArticleFile = jsonData;
        const processedArticles = processMultiArticleData(multiArticleData);
        
        // Look for the article with matching slug
        const matchingArticle = processedArticles.find(processedArticle => processedArticle.slug === slug);
        if (matchingArticle) {
          return {
            slug: matchingArticle.slug,
            title: matchingArticle.articleName,
            date: matchingArticle.date,
            coverImage: matchingArticle.coverImage,
            author: {
              name: matchingArticle.author,
              picture: matchingArticle.authorImage
            },
            excerpt: matchingArticle.excerpt,
            ogImage: {
              url: matchingArticle.coverImage
            },
            content: matchingArticle.articleText,
            tags: matchingArticle.tags,
            source: 'json' as const,
            featured: matchingArticle.featured,
            priority: matchingArticle.priority,
            category: matchingArticle.category
          } as Post;
        }
      } else {
        // Single article file
        const articleData: ArticleData = jsonData;
        const processedArticle = processArticleData(articleData, filename);
        
        if (processedArticle.slug === slug) {
          return {
            slug: processedArticle.slug,
            title: processedArticle.articleName,
            date: processedArticle.date,
            coverImage: processedArticle.coverImage,
            author: {
              name: processedArticle.author,
              picture: processedArticle.authorImage
            },
            excerpt: processedArticle.excerpt,
            ogImage: {
              url: processedArticle.coverImage
            },
            content: processedArticle.articleText,
            tags: processedArticle.tags,
            source: 'json' as const,
            featured: processedArticle.featured,
            priority: processedArticle.priority,
            category: processedArticle.category
          } as Post;
        }
      }
    } catch (error) {
      console.error(`Error processing file ${filename} in getPostBySlug:`, error);
      // Continue processing other files even if one fails
    }
  }

  throw new Error(`Post with slug "${slug}" not found`);
}

export function getAllPosts(): Post[] {
  const allPosts: Post[] = [];

  // Get markdown posts
  if (fs.existsSync(postsDirectory)) {
    const markdownSlugs = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    const markdownPosts = markdownSlugs
      .map((slug) => {
        const realSlug = slug.replace(/\.md$/, "");
        const fullPath = join(postsDirectory, `${realSlug}.md`);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        return { 
          ...data, 
          slug: realSlug, 
          content, 
          source: 'markdown' as const,
          tags: data.tags || [],
          featured: data.featured || false,
          priority: data.priority || 5,
          category: data.category || (data.tags?.[0] || 'General AI')
        } as Post;
      });
    allPosts.push(...markdownPosts);
  }

  // Get JSON articles (both single and multi-article files)
  if (fs.existsSync(articlesDirectory)) {
    const jsonFiles = fs.readdirSync(articlesDirectory).filter(file => file.endsWith('.json'));
    const jsonPosts: Post[] = [];
    
    jsonFiles.forEach((filename) => {
      try {
        const jsonPath = join(articlesDirectory, filename);
        const fileContents = fs.readFileSync(jsonPath, "utf8");
        const jsonData = JSON.parse(fileContents);
        
        // Check if it's a multi-article file (array of articles)
        if (Array.isArray(jsonData)) {
          // Multi-article file - simple array
          const multiArticleData: MultiArticleFile = jsonData;
          const processedArticles = processMultiArticleData(multiArticleData);
          
          processedArticles.forEach(processedArticle => {
            jsonPosts.push({
              slug: processedArticle.slug,
              title: processedArticle.articleName,
              date: processedArticle.date,
              coverImage: processedArticle.coverImage,
              author: {
                name: processedArticle.author,
                picture: processedArticle.authorImage
              },
              excerpt: processedArticle.excerpt,
              ogImage: {
                url: processedArticle.coverImage
              },
              content: processedArticle.articleText,
              tags: processedArticle.tags,
              source: 'json' as const,
              featured: processedArticle.featured,
              priority: processedArticle.priority,
              category: processedArticle.category
            } as Post);
          });
        } else {
          // Single article file
          const articleData: ArticleData = jsonData;
          const processedArticle = processArticleData(articleData, filename);
          
          jsonPosts.push({
            slug: processedArticle.slug,
            title: processedArticle.articleName,
            date: processedArticle.date,
            coverImage: processedArticle.coverImage,
            author: {
              name: processedArticle.author,
              picture: processedArticle.authorImage
            },
            excerpt: processedArticle.excerpt,
            ogImage: {
              url: processedArticle.coverImage
            },
            content: processedArticle.articleText,
            tags: processedArticle.tags,
            source: 'json' as const,
            featured: processedArticle.featured,
            priority: processedArticle.priority,
            category: processedArticle.category
          } as Post);
        }
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
        // Continue processing other files even if one fails
      }
    });
    
    allPosts.push(...jsonPosts);
  }

  // Sort all posts by date in descending order
  return allPosts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

// New function to get hero post using smart selection
export function getHeroPost(): Post | null {
  const allPosts = getAllPosts();
  return selectHeroPost(allPosts);
}
