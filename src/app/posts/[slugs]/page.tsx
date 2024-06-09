import { allPosts } from "contentlayer/generated";

export default function BlogPage(props: any) {
  const {slug} = props
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.publishedDate).toISOString();

  return <>
    {publishedAt}
  </>
}
