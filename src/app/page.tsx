import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { FilteredStories } from "@/app/_components/filtered-stories";
import { getAllPosts, getHeroPost } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();
  const heroPost = getHeroPost();
  
  // Get remaining posts (excluding the hero)
  const morePosts = allPosts.filter(post => post.slug !== heroPost?.slug);

  return (
    <main>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
            tags={heroPost.tags}
          />
        )}
        {morePosts.length > 0 && <FilteredStories posts={morePosts} />}
      </Container>
    </main>
  );
}
