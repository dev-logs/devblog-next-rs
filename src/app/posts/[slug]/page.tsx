"use client"
import { allPosts } from "contentlayer/generated";
import { MdxContent } from "../mdx";
import Image from "next/image";
import { FooterHtml } from "@/app/components/footer";

export default function PostPage(props: any = {}) {
  const {params: {slug}} = props

  const post = allPosts.find((post) => post._raw.flattenedPath === slug)!;

  return <div className="w-[100vw] flex flex-col items-center">
     <div className="absolute inset-x-0 top-0 w-[100vw] xl:h-[80vh] max-h-[1100px] h-[40vh] bg-gradient-to-t from-black"/>
     <Image
        src={post.image.filePath.replace("../public", "")}
        placeholder="blur"
        blurDataURL={post.image.blurhashDataUrl}
        alt={post.title}
        width={post.image.width}
        height={post.image.height}
        className="aspect-square xl:h-[80vh] h-[40vh] max-h-[1100px] w-full object-cover object-center"
        priority
      />
     <article className="prose md:prose-xl prose-sm mb-56 w-full xl:p-0 p-5">
      <MdxContent post={post} />
     </article>
     <FooterHtml/>
  </div>
}
