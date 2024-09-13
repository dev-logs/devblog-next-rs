import React from "react";
import PostPageContent from "@/app/posts/[slug]/content";
import { allPosts } from "contentlayer/generated";
import { PostDetailLoading } from "./client";
import {NavigationBar} from "@/app/components/navigation-bar";
import { siteMetadata } from "@/app/utils/site-meta-data";

export async function generateStaticParams() {
  return allPosts.map((post) => {
    return {
      slug: post.slug
    }
  })
}

export async function generateMetadata({ params }: any) {
  const post = allPosts.find((post) => post.slug === params.slug);
  if (!post) {
    return {}
  }

  const publishedAt = new Date(post.publishedDate!).toISOString();
  const modifiedAt = new Date(post.publishedDate!).toISOString();

  let imageList = [siteMetadata.siteLogo];
  if (post.image) {
    imageList = [siteMetadata.siteUrl + post.image.filePath.replace("../public", "")]
  }

  const ogImages = imageList.map((img) => {
    return { url: img.includes("http") ? img : siteMetadata.siteUrl + img };
  });

  const authors = [{name: post.authorFullName}]

  return {
    ...siteMetadata,
    authors,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: siteMetadata.siteUrl + post.url,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ogImages,
    },
  }
}

export default function PostPage(props: any) {
    return <div className={'h-screen'}>
        <NavigationBar />
        <PostDetailLoading/>
        <div className={`absolute top-0 left-0 z-0`}>
            <PostPageContent {...props}/>
        </div>
    </div>
}
