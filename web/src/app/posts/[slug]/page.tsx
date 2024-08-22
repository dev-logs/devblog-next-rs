import React from "react";
import PostPageContent from "@/app/posts/[slug]/content";
import { allPosts } from "contentlayer/generated";
import { PostDetailLoading } from "./client";

export async function generateStaticParams() {
  return allPosts.map((post) => {
    return {
      slug: post.slug
    }
  })
}

export default function PostPage(props: any) {
    return <div className={'h-screen'}>
        <PostDetailLoading/>
        <div className={`absolute top-0 left-0 z-0`}>
            <PostPageContent {...props}/>
        </div>
    </div>
}
