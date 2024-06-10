"use client";

import { allPosts } from "contentlayer/generated";
import { MdxContent } from "../mdx";
import Image from "next/image";
import { FooterHtml } from "@/app/components/footer";
import { TableOfContent } from "../table-of-content";
import { PostTitle } from "../title";

export default function PostPage(props: any = {}) {
  const {
    params: { slug },
  } = props;

  const post = allPosts.find((post) => post._raw.flattenedPath === slug)!;

  return (
    <div className="w-screen flex flex-col">
      <PostTitle post={post}/>
      <div className="grid grid-cols-12 w-full">
        <div className="lg:col-span-3 col-span-full lg:items-start items-center flex flex-row h-fit lg:sticky lg:left-5 lg:top-10 lg:justify-start justify-center">
          <TableOfContent post={post} />
        </div>
        <div className="flex lg:justify-start flex-col lg:items-start lg:pl-16 items-center lg:col-span-9 col-span-full">
          <article className="prose md:prose-xl prose-sm lg:mb-56 mb-14 w-full lg:p-0 p-8">
            <MdxContent post={post} />
          </article>
        </div>
      </div>
      <FooterHtml />
    </div>
  );
}
