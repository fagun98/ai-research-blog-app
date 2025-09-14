import { type Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { Tags } from "./tags";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
  tags?: string[];
};

export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  tags,
}: Props) {
  return (
    <article className="group border-b border-slate-200 dark:border-slate-700 py-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
      <div className="flex gap-6">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24">
          <Link href={`/posts/${slug}`} className="block">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Date */}
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            <DateFormatter dateString={date} />
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-semibold mb-3 leading-tight">
            <Link 
              href={`/posts/${slug}`} 
              className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
            >
              {title}
            </Link>
          </h3>

          {/* Tags */}
          <div className="mb-3">
            <Tags tags={tags || []} className="mb-0" />
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={author.picture}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {author.name}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
