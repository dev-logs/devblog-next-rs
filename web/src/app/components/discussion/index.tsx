import React, { useCallback, useEffect, useState } from "react"
import { DiscussionItem } from "./item"
import { DiscussionInput } from "./input"
import { Post } from "contentlayer/generated"
import { useService } from "@/app/hooks/service"
import useInfiniteScroll from "react-infinite-scroll-hook"

interface Discussion {
  id: number;
  user: string;
  avatar: string;
  content: string;
  reactions: { emoji: string; count: number }[];
  timestamp: string;
}

interface DiscussionsProps {
  post: Post;
  discussions: Discussion[];
  totalComments: number;
}

export const Discussions = ({ totalComments, post }: DiscussionsProps) => {
  const getDiscussions = useService().discussion().getDiscussions();
  const [loading, setLoading] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    if (getDiscussions.data && getDiscussions.data.length) {
      getDiscussions.setPageState(getDiscussions.pageState + 1)
      setDiscussions([...(getDiscussions.data as any)])
    }
  }, [getDiscussions.data])

  const onLoadMore = useCallback(() => {
    getDiscussions.setPageState(getDiscussions.pageState || 1)
    getDiscussions.setRowsPerPage(10)
    getDiscussions.trigger()
  }, [])

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: !getDiscussions.data || (getDiscussions.data || [] as any).length,
    onLoadMore,
  })

  return (
    <div className="prose max-w-prose pl-2 2xl:prose-xl md:prose-md prose-sm lg:prose-lg h-fit overflow-x-hidden z-20 text-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-row justify-center items-center">
          <h2 className="font-semibold text-white">Discussions</h2>
          <div className="ml-2 bg-gray-50 text-black text-xs px-2 py-1 rounded-full">
            {totalComments}
          </div>
        </div>
      </div>
      <DiscussionInput post={post} />
      {discussions.map((discussion, index) => (
        <DiscussionItem key={index} discussion={discussion} />
      ))}
      <div ref={sentryRef}/>
      <div className="flex justify-center items-center mt-4">
        <span className="text-gray-500">
          <i className="ri-refresh-line mr-1"></i>Loading
        </span>
      </div>
    </div>
  );
};
