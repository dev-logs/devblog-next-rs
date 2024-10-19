import { allPosts } from "contentlayer/generated"
import { MdxContent } from "../mdx"
import { TableOfContent } from "../table-of-content"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { tasks, TASKS } from "@/app/posts/[slug]/config"
import { Toaster } from "react-hot-toast"
import { PostInteraction } from "./client"

export default function PostPageContent(props: any) {
  return (
    <div className={"relative h-screen w-screen"}>
      <div className={"h-screen w-screen"}>
        <HtmlDom {...props} />
      </div>
    </div>
  );
}

function HtmlDom(props: any = {}) {
  const {
    params: { slug },
  } = props;

  const post = allPosts.find((post) => post.slug === slug)!;
  const TitleLazy: any = dynamic(() => (tasks as any)[TASKS.POST_TITLE]);
  const FooterLazy: any = dynamic(() => (tasks as any)[TASKS.POST_FOOTER]);
 
  return (
    <div className={"h-full w-full"}>
      <Toaster position="bottom-right"/>
      <div className=" flex flex-col bg-background">
        <Suspense>
          <TitleLazy post={post} />
        </Suspense>
        <div className="container grid grid-cols-12 w-full backdrop-blur-3xl">
          <div className="lg:col-span-3 col-span-full lg:items-start items-center flex flex-row h-fit lg:sticky lg:left-5 lg:top-20 lg:justify-start justify-center">
            <TableOfContent post={post} />
          </div>
          <div className="flex lg:justify-start flex-col cols-span-full lg:pl-16 items-center lg:col-span-6 col-span-full md:mt-8 mt-2">
            <article className="container max-w-full rounded-xl backdrop-blur-lg">
              <MdxContent post={post}/>
              <PostInteraction post={post}/>
            </article>
          </div>
        </div>
        <div className="h-full">
          <Suspense>
            <FooterLazy post={post} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

