import React from 'react'
import { Discussion } from 'schema/dist/schema/devlog/devblog/entities/discussion_pb';

interface DiscussionItemProps {
    discussion: Discussion
}

export const DiscussionItem = ({ discussion }: DiscussionItemProps) => {
    return (
        <div className="py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {/* <h5 className="ml-2 font-semibold">{discussion.getUser().getUser().name}</h5> */}
                </div>
                <button className="btn dropdown">
                    <i className="ri-more-line"></i>
                </button>
            </div>
            <div className="mt-2 text-gray-300">
                <p>{discussion.getContent()}</p>
            </div>
            <div className="flex items-center mt-2">
                <button className="btn">
                    <i className="ri-emotion-line"></i>
                </button>
                <span className="text-gray-50 text-sm">{discussion.getCreatedAt()?.toString()}</span>
            </div>
        </div>
    );
};
