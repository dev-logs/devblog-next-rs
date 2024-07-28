"use client";

import { allPosts, Post } from "contentlayer/generated";
import { Post as PostEntity } from 'schema/dist/schema/devlog/devblog/entities/post_pb'
import { MdxContent } from "../mdx";
import { TableOfContent } from "../table-of-content";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect } from "react";
import { TASKS } from "@/app/posts/[slug]/config";
import {
  RiveEmojiFaceLove,
  RiveText,
  ThumbUpRiveComponent,
} from "@/app/components/rive/rive-component";
import { Discussions } from "@/app/components/discussion";
import { Toaster } from "react-hot-toast";
import { useService } from "@/app/hooks/service";

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
    tasks,
  } = props;

  const post = allPosts.find((post) => post.url.includes(slug))!;
  const getPostDb = useService().post().get();
  const viewPost = useService().post().view();
  const TitleLazy: any = dynamic(() => tasks[TASKS.POST_TITLE]);
  const FooterLazy: any = dynamic(() => tasks[TASKS.POST_FOOTER]);

  useEffect(() => {
    if (post) {
      getPostDb.setTitle(post.title)
      getPostDb.trigger()
      viewPost.setPostTitle(post.title)
      viewPost.trigger()
    }
  }, [post])

  return (
    <div className={"h-full w-full"}>
      <Toaster position="bottom-right"/>
      <div className=" flex flex-col">
        <Suspense>
          <TitleLazy post={post} />
        </Suspense>
        <div className="grid grid-cols-12 w-full lg:pb-56 pb-14 backdrop-blur-3xl">
          <div className="lg:col-span-3 col-span-full lg:items-start items-center flex flex-row h-fit lg:sticky lg:left-5 lg:top-20 lg:justify-start justify-center">
            <TableOfContent post={post} />
          </div>
          <div className="flex lg:justify-start flex-col lg:items-start cols-span-full lg:pl-16 items-center lg:col-span-6 col-span-full md:mt-8 mt-2">
            <article className="max-w-full mb-10 sm:px-8 rounded-xl backdrop-blur-lg px-2">
              <MdxContent post={post}/>
              <LikeSection post={post} totalLikes={getPostDb.data?.totalLikes ?? 0} totalViews={viewPost.data ?? getPostDb.data?.totalViews ?? 0}/>
              <Discussions post={post}/>
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

function LikeSection(props: {post: Post, totalViews: number, totalLikes: number}) {
  const {post, totalLikes, totalViews} = props

  const likeService = useService().post().like()
  const likeHandler = useCallback((count: number) => {
    likeService.setCount(count)
    likeService.setPostTitle(post.title)
    likeService.trigger()
  }, [post])

  return <div className="flex flex-row top-32 mt-10 justify-start items-start">
    <div className="flex flex-row rounded-lg">
      <div className="w-[100px] h-[100px]">
        <RiveText text={`${likeService.data ?? totalLikes} likes`} />
      </div>
      <div
        className="w-[90px] h-[90px]"
        style={{ translate: "-50% 5%" }}>
        <ThumbUpRiveComponent onLikeEnd={likeHandler}/>
      </div>
      <div className="flex flex-row" style={{ translate: "-30%" }}>
        <div className="w-[100px] h-[100px]">
          <RiveText text={`${totalViews} views`} />
        </div>
        <div
          className="w-[60px] h-[60px]"
          style={{ translate: "-30% 30%" }}>
          <RiveEmojiFaceLove />
        </div>
      </div>
    </div>
  </div>
}
