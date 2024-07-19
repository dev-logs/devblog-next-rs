import React from 'react'
import {DiscussionItem} from './item'
import {DiscussionInput} from './input'
import { Post } from 'contentlayer/generated'

interface Discussion {
    id: number
    user: string
    avatar: string
    content: string
    reactions: { emoji: string; count: number }[]
    timestamp: string
}

interface DiscussionsProps {
    post: Post
    discussions: Discussion[]
    totalComments: number
}

export const Discussions = ({ discussions, totalComments, post }: DiscussionsProps) => {
    return (
        <div
            className="prose max-w-prose pl-2 2xl:prose-xl md:prose-md prose-sm lg:prose-lg h-fit overflow-x-hidden z-20 text-white shadow rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-row justify-center items-center">
                    <h2 className="font-semibold text-white">Discussions</h2>
                    <div className="ml-2 bg-gray-50 text-black text-xs px-2 py-1 rounded-full">{totalComments}</div>
                </div>
            </div>
            <DiscussionInput post={post} />
            {discussions.map(discussion => (
                <DiscussionItem key={discussion.id} discussion={discussion}/>
            ))}
            <div className="flex justify-center items-center mt-4">
            <span className="text-gray-500">
              <i className="ri-refresh-line mr-1"></i>Loading
            </span>
            </div>
        </div>
    )
}
