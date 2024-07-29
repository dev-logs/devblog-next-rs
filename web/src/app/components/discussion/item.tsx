import React from 'react'
import { Discussion } from 'schema/dist/schema/devlog/devblog/entities/discussion_pb';

interface DiscussionItemProps {
    discussion: Discussion
}

export const DiscussionItem = ({ discussion }: DiscussionItemProps) => {
    const user = discussion?.getUser()?.getObject()!;
    return (
        <div className="py-7 font-roboto">
            <div className="flex flex-row items-center h-12 gap-2">
              <img src={user.getAvatarObject()?.getDownloadUrl()} className='w-10 h-10 rounded-full'/>
              <h5 className="ml-2 font-roboto font-semibold xl:text-xl text-lg">{user.getName() || 'No name'}</h5>
            </div>
            <div className="text-gray-300 xl:text-lg text-sm">
                <p>{discussion.getContent()}</p>
            </div>
            <div className="flex items-center mt-1">
                <span className="text-gray-50 text-sm">{new Date().toString()}</span>
            </div>
        </div>
    );
};
