import { Post } from "@/interfaces/post";
import Link from "next/link";
import DateFormatter from "./date-formatter";

interface RelatedArticlesProps {
  posts: Post[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 mb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Thumbnail */}
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <DateFormatter dateString={post.date} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 leading-tight">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
                  >
                    {post.title}
                  </Link>
                </h3>

                {/* Category */}
                {post.category && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {post.category}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
