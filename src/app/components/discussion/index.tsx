import React from 'react';
import {DiscussionItem} from './item';
import {DiscussionInput} from './input';

interface Discussion {
    id: number;
    user: string;
    avatar: string;
    content: string;
    reactions: { emoji: string; count: number }[];
    timestamp: string;
}

interface DiscussionsProps {
    discussions: Discussion[];
    totalComments: number;
}

export const Discussions = ({ discussions, totalComments }: DiscussionsProps) => {
    return (
        <div className="max-w-prose 2xl:prose-xl prose-lg scrollbar overflow-scroll overflow-x-hidden h-screen bg-white bg-opacity-30 backdrop-blur-xl text-white p-8 shadow rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold">Discussions</h2>
                    <div className="ml-2 bg-gray-50 text-black text-xs px-2 py-1 rounded-full">{totalComments}</div>
                </div>
                <div className="flex items-center">
                    <label className="mr-2">
                        <input type="radio" name="sort" value="latest" defaultChecked className="mr-1" />
                        Latest
                    </label>
                    <label>
                        <input type="radio" name="sort" value="popular" className="mr-1" />
                        Popular
                    </label>
                </div>
            </div>
            <DiscussionInput/>
            {discussions.map(discussion => (
                <DiscussionItem key={discussion.id} discussion={discussion} />
            ))}
            <div className="flex justify-center items-center mt-4">
        <span className="text-gray-500">
          <i className="ri-refresh-line mr-1"></i>Loading
        </span>
            </div>
        </div>
    );
};
