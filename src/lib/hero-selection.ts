import { Post } from "@/interfaces/post";
import heroConfig from "@/config/hero.json";

interface HeroScore {
  post: Post;
  score: number;
  reasons: string[];
}

export function selectHeroPost(posts: Post[]): Post | null {
  if (posts.length === 0) return null;

  // Strategy 1: Manual override
  if (heroConfig.manualHero) {
    const manualPost = posts.find(post => post.slug === heroConfig.manualHero);
    if (manualPost) {
      console.log(`Hero: Manual override - ${manualPost.title}`);
      return manualPost;
    }
  }

  // Strategy 2: Smart selection with scoring
  if (heroConfig.selectionStrategy === "smart") {
    return selectSmartHero(posts);
  }

  // Strategy 3: Simple newest (fallback)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

function selectSmartHero(posts: Post[]): Post {
  const scoredPosts: HeroScore[] = posts
    .filter(post => !(heroConfig.blacklistedSlugs as string[]).includes(post.slug))
    .filter(post => isPostRecent(post))
    .map(post => ({
      post,
      score: calculateHeroScore(post),
      reasons: []
    }))
    .sort((a, b) => b.score - a.score);

  const selectedPost = scoredPosts[0];
  
  console.log(`Hero selected: ${selectedPost.post.title} (Score: ${selectedPost.score})`);
  console.log(`Reasons: ${selectedPost.reasons.join(", ")}`);
  
  return selectedPost.post;
}

function calculateHeroScore(post: Post): number {
  let score = 0;
  const reasons: string[] = [];

  // Featured articles get highest priority
  if (post.featured) {
    score += heroConfig.priorityFactors.featured;
    reasons.push("Featured article");
  }

  // Recent articles get bonus points
  const daysSincePublication = getDaysSincePublication(post.date);
  if (daysSincePublication <= 7) {
    score += heroConfig.priorityFactors.recent;
    reasons.push("Recent publication");
  }

  // Category-based scoring
  if (post.category && heroConfig.categoryWeights[post.category as keyof typeof heroConfig.categoryWeights]) {
    score += heroConfig.categoryWeights[post.category as keyof typeof heroConfig.categoryWeights];
    reasons.push(`High-value category: ${post.category}`);
  }

  // Tag-based scoring
  if (post.tags) {
    const tagScore = post.tags.reduce((acc, tag) => {
      const weight = heroConfig.categoryWeights[tag as keyof typeof heroConfig.categoryWeights] || 1;
      return acc + weight * 0.1; // Small bonus for tags
    }, 0);
    score += tagScore;
    if (tagScore > 0) {
      reasons.push("High-value tags");
    }
  }

  // Priority field override
  if (post.priority) {
    score += post.priority;
    reasons.push(`Custom priority: ${post.priority}`);
  }

  // Penalty for very old articles
  const maxAge = parseMaxAge(heroConfig.maxAge);
  if (daysSincePublication > maxAge) {
    score *= 0.1; // Heavily penalize old articles
    reasons.push("Age penalty applied");
  }

  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

function getDaysSincePublication(dateString: string): number {
  const publicationDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publicationDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isPostRecent(post: Post): boolean {
  const daysSincePublication = getDaysSincePublication(post.date);
  return daysSincePublication <= parseMaxAge(heroConfig.maxAge);
}

function parseMaxAge(maxAgeString: string): number {
  const match = maxAgeString.match(/(\d+)\s*(day|days)/);
  if (match) {
    return parseInt(match[1]);
  }
  return 30; // Default to 30 days
}

// Utility function to manually set a hero article
export function setManualHero(slug: string): void {
  // This would typically update the hero.json file
  // For now, we'll just log it
  console.log(`Manual hero set to: ${slug}`);
}

// Utility function to clear manual hero (return to automatic selection)
export function clearManualHero(): void {
  console.log("Manual hero cleared, returning to automatic selection");
}
