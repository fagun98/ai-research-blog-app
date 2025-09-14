import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { BRAND_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import { Tags } from "@/app/_components/tags";
import { ShareButtons } from "@/app/_components/share-buttons";
import { RelatedArticles } from "@/app/_components/related-articles";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .filter(p => p.tags?.some(tag => post.tags?.includes(tag)))
    .slice(0, 3);

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        
        {/* Article Header */}
        <article className="mb-16">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <Tags tags={post.tags} className="justify-center" />
            </div>
          )}
        </article>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <PostBody content={content} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-8">
                {/* Share Buttons */}
                <ShareButtons 
                  title={post.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://aipapers.com'}/posts/${post.slug}`}
                />

                {/* Article Info */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Article Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Published:</span>
                      <br />
                      <span className="text-slate-900 dark:text-slate-100">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Category:</span>
                      <br />
                      <span className="text-slate-900 dark:text-slate-100">{post.category || 'General AI'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Reading Time:</span>
                      <br />
                      <span className="text-slate-900 dark:text-slate-100">
                        {Math.ceil(post.content.split(' ').length / 200)} min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={post.author.picture}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{post.author.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">AI Researcher & Educator</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Passionate about making complex AI concepts accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <RelatedArticles posts={relatedPosts} />
        )}
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | ${BRAND_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
