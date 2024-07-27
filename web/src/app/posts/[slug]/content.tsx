"use client";

import { allPosts, Post } from "contentlayer/generated";
import { MdxContent } from "../mdx";
import { TableOfContent } from "../table-of-content";
import dynamic from "next/dynamic";
import { Suspense, useCallback } from "react";
import { TASKS } from "@/app/posts/[slug]/config";
import {
  RiveEmojiFaceLove,
  RiveText,
  ThumbUpRiveComponent,
} from "@/app/components/rive/rive-component";
import { Discussions } from "@/app/components/discussion";
import { Toaster } from "react-hot-toast";
import { useService } from "@/app/hooks/service";

const discussions = [
  {
    id: 1,
    user: "Floyd Miles",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    content:
      "Actually, now that I try out the links on my message, above, none of them take me to the secure site. Only my shortcut on my desktop, which I created years ago.",
    reactions: [],
    timestamp: "6 hours ago",
  },
  {
    id: 2,
    user: "Jane Cooper",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "I have also faced similar issues. The links do not redirect properly.",
    reactions: [],
    timestamp: "2 hours ago",
  },
  {
    id: 3,
    user: "Albert Flores",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content:
      "Before installing this plugin please put back again your WordPress and site URL back to http.",
    reactions: [],
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    user: "Bessie Cooper",
    avatar: "https://randomuser.me/api/portraits/women/74.jpg",
    content: "Hi @Albert Flores. Thanks for your reply.",
    reactions: [],
    timestamp: "18 minutes ago",
  },
  {
    id: 5,
    user: "Cody Fisher",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    content: "Is anyone else experiencing problems with the site?",
    reactions: [],
    timestamp: "10 minutes ago",
  },
];

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

  const post = allPosts.find((post) => post._raw.flattenedPath === slug)!;
  const TitleLazy: any = dynamic(() => tasks[TASKS.POST_TITLE]);
  const FooterLazy: any = dynamic(() => tasks[TASKS.POST_FOOTER]);

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
              <MdxContent post={post} />
              <LikeSection post={post}/>
              <Discussions
                post={post}
              />
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

function LikeSection(props: {post: Post}) {
  const {post} = props

  const likeService = useService().post().like()
  const likeHandler = useCallback((count: number) => {
    likeService.setCount(count)
    likeService.setPostTitle(post.title)
    likeService.trigger()
  }, [post])

  return <div className="flex flex-row top-32 mt-10 justify-start items-start">
    <div className="flex flex-row rounded-lg">
      <div className="w-[100px] h-[100px]">
        <RiveText text="0 likes" />
      </div>
      <div
        className="w-[90px] h-[90px]"
        style={{ translate: "-50% 5%" }}>
        <ThumbUpRiveComponent onLikeEnd={likeHandler}/>
      </div>
      <div className="flex flex-row" style={{ translate: "-30%" }}>
        <div className="w-[100px] h-[100px]">
          <RiveText text="0 views" />
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
