import React from 'react';

interface Reaction {
    emoji: string;
    count: number;
}

interface DiscussionItemProps {
    discussion: {
        id: number;
        user: string;
        avatar: string;
        content: string;
        reactions: Reaction[];
        timestamp: string;
    };
}

export const DiscussionItem = ({ discussion }: DiscussionItemProps) => {
    return (
        <div className="py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={discussion.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <h5 className="ml-2 font-semibold">{discussion.user}</h5>
                </div>
                <button className="btn dropdown">
                    <i className="ri-more-line"></i>
                </button>
            </div>
            <div className="mt-2 text-gray-50">
                <p>{discussion.content}</p>
            </div>
            <div className="flex items-center mt-2">
                <button className="btn">
                    <i className="ri-emotion-line"></i>
                </button>
                <div className="flex items-center ml-4">
                    {discussion.reactions.map((reaction, index) => (
                        <button key={index} className="btn react flex items-center mr-2">
                            <img src={reaction.emoji} alt="" className="w-4 h-4" />
                            <span className="ml-1">{reaction.count}</span>
                        </button>
                    ))}
                </div>
                <span className="ml-4 text-gray-50 text-sm">{discussion.timestamp}</span>
            </div>
        </div>
    );
};
