'use client'
import React, { useCallback, useEffect, useState } from "react";
import { Discussions } from "@/app/components/discussion";
import { useService } from "@/app/hooks/service";
import { Post } from "@devlog/schema-ts";
import { loadRive, RiveEmojiFaceLove, RiveText, ThumbUpRiveComponent } from "@/app/components/rive/rive-component";
import { LoadingOverlay } from "@/app/components/loading-overlay";
import { tasks } from "./config";

export function PostDetailLoading() {
  return <>
      <div className={"fixed top-0 left-0 z-10 h-full"}>
        <LoadingOverlay tasks={tasks} noModel={true}/>
      </div>
  </>
}

export function PostInteraction({post}: any) {
  const getPostDb = useService().post().get();
  const viewPost = useService().post().view();

  const [isRiveReady, updateRiveReady] = useState(false)

  useEffect(() => {
    loadRive().then(() => {
      updateRiveReady(true)
    })
  }, [])

  useEffect(() => {
    if (post) {
      getPostDb.setTitle(post.title)
      getPostDb.trigger()
      viewPost.setPostTitle(post.title)
      viewPost.trigger()
    }
  }, [post])

  return isRiveReady ? <>
     <LikeSection post={post} totalLikes={getPostDb.data?.totalLikes ?? 0} totalViews={viewPost.data ?? getPostDb.data?.totalViews ?? 0}/>
     <Discussions post={post}/>
  </> : <></>
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
