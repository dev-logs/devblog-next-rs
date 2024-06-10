"use client"
import { allPosts } from "contentlayer/generated";
import { MdxContent } from "../mdx";
import Image from "next/image";

export default function PostPage(props: any = {}) {
  const {params: {slug}} = props

  const post = allPosts.find((post) => post._raw.flattenedPath === slug)!;

  return <div className="w-full flex flex-col items-center">
     <div className="absolute inset-x-0 top-0 w-full h-[50vh] bg-gradient-to-t from-black"></div>
     <Image
        src={post.image.filePath.replace("../public", "")}
        placeholder="blur"
        blurDataURL={post.image.blurhashDataUrl}
        alt={post.title}
        width={post.image.width}
        height={post.image.height}
        className="aspect-square h-[50vh] w-full object-cover object-center"
        priority
        sizes="100vw"
      />
     <article className="prose lg:prose-xl">
      <MdxContent post={post} />
     </article>
  </div>
}
