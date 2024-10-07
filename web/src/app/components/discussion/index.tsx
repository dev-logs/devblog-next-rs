'use client'
import React, { useCallback, useEffect, useState } from "react"
import { DiscussionItem } from "./item"
import { DiscussionInput } from "./input"
import { Post } from "contentlayer/generated"
import { useService } from "@/app/hooks/service"
import {Paging, Discussion} from "@devlog/schema-ts"

interface DiscussionsProps {
  post: Post;
}

export const Discussions = ({ post }: DiscussionsProps) => {
  const initialPaging = new Paging()
  initialPaging.page = 1
  initialPaging.rowsPerPage = 8

  const getDiscussions = useService().discussion().getDiscussions()
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [paging, setPaging] = useState({page: initialPaging})
  const [pageList, setPageList] = useState<number[]>([])

  useEffect(() => {
    if (post) {
      getDiscussions.setTitle(post.title)
    }
  }, [post])

  useEffect(() => {
    const newPageList: number[] = []
    for (let i = 0; i < paging.page.totalPages; i++) {
      newPageList.push(i + 1)
    }

    setPageList(newPageList)
  }, [paging, paging.page.totalPages])

  useEffect(() => {
    const newDiscussions = getDiscussions.data?.discussions || []
    setDiscussions(newDiscussions)
    const newPaging = getDiscussions.data?.paging || initialPaging;
    setPaging({
      page: newPaging
    })
  }, [getDiscussions.data])

  useEffect(() => {
    getDiscussions.setPage(paging.page)
    getDiscussions.trigger()
  }, [paging.page.page])

  const onSelectedPage = useCallback((index: number) => {
    paging.page.page = index
    setPaging({page: paging.page})
  }, [paging])

  const reload = useCallback(() => {
    setPaging({page: initialPaging})
    getDiscussions.setPage(initialPaging)
    getDiscussions.trigger()
  }, [paging, getDiscussions])

  return (
    <div className="prose max-w-prose 2xl:prose-xl md:prose-md prose-sm lg:prose-lg h-fit overflow-x-hidden z-20 text-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-row justify-center items-center">
          <h2 className="font-semibold text-white">Discussions</h2>
        </div>
      </div>
      <DiscussionInput post={post} onSent={reload} />
      {discussions.map((discussion, index) => (
        <DiscussionItem key={index} discussion={discussion} />
      ))}
      <div className="flex flex-row w-full h-fit p-3 gap-1 justify-center items-center">
        {
          pageList.map((pageItem, index) =>
            <button key={index} onClick={() => onSelectedPage(pageItem)} className={`${paging.page.page === pageItem ? 'bg-blue-400' : 'bg-blue-800'} text-white font-roboto px-2 text-sm hover:bg-blue-400 rounded-sm h-fit w-fit p-1`}>{pageItem}</button>
          )
        }
      </div>
    </div>
  );
};
