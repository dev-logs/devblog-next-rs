import React, { useCallback, useEffect, useState } from "react"
import { DiscussionItem } from "./item"
import { DiscussionInput } from "./input"
import { Post } from "contentlayer/generated"
import { useService } from "@/app/hooks/service"
import { Discussion } from "schema/dist/schema/devlog/devblog/entities/discussion_pb"
import { Paging } from "schema/dist/schema/devlog/rpc/paging_pb"

interface DiscussionsProps {
  post: Post;
}

export const Discussions = ({ post }: DiscussionsProps) => {
  const initialPaging = new Paging()
  initialPaging.setPage(1)
  initialPaging.setRowsPerPage(8)

  const getDiscussions = useService().discussion().getDiscussions()
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [paging, setPaging] = useState({page: initialPaging})
  const [pageList, setPageList] = useState<number[]>([])

  useEffect(() => {
    let newPageList: number[] = []
    for (let i = 0; i < paging.page.getTotalPages(); i++) {
      newPageList.push(i + 1)
    }

    setPageList(newPageList)
  }, [paging, paging.page.getTotalPages()])

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
  }, [paging.page.getPage()])

  const onSelectedPage = useCallback((index: number) => {
    paging.page.setPage(index)
    setPaging({page: paging.page})
  }, [paging])

  const reload = useCallback(() => {
    setPaging({page: initialPaging})
    getDiscussions.setPage(initialPaging)
    getDiscussions.trigger()
  }, [paging, getDiscussions])

  return (
    <div className="prose max-w-prose pl-2 2xl:prose-xl md:prose-md prose-sm lg:prose-lg h-fit overflow-x-hidden z-20 text-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-row justify-center items-center">
          <h2 className="font-semibold text-white">Discussions</h2>
          <div className="ml-2 bg-gray-50 text-black text-xs px-2 py-1 rounded-full">
          </div>
        </div>
      </div>
      <DiscussionInput post={post} onSent={reload} />
      {discussions.map((discussion, index) => (
        <DiscussionItem key={index} discussion={discussion} />
      ))}
      <div className="flex flex-row w-full h-fit p-3 gap-1 justify-center items-center">
        {
          pageList.map((pageItem, index) =>
            <button key={index} onClick={() => onSelectedPage(pageItem)} className={`${paging.page.getPage() === pageItem ? 'bg-blue-400' : 'bg-blue-800'} text-white font-roboto px-2 text-sm hover:bg-blue-400 rounded-sm h-fit w-fit p-1`}>{pageItem}</button>
          )
        }
      </div>
      <div className="flex justify-center items-center mt-4">
      </div>
    </div>
  );
};
