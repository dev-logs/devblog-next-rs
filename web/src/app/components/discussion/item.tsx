import React, { useMemo } from 'react'
import moment from 'moment'
import {Discussion, User} from '@devlog/schema-ts';

interface DiscussionItemProps {
    discussion: Discussion
}

export const DiscussionItem = ({ discussion }: DiscussionItemProps) => {
    const user = discussion?.user?.link.value! as User;
    const formatedDate = useMemo(() => {
      if (discussion.createdAt) {
        return moment(new Date(Number(discussion.createdAt!.utcMillisSinceEpoch!))).format('ddd, MM DD YY, hh::mm')
      }
    }, [discussion.createdAt])

    return (
        <div className="py-7 font-roboto">
            <div className="flex flex-row items-center h-12 gap-2">
              <img src={user.avatarObject?.content.value as any} className='w-10 h-10 rounded-full'/>
              <h5 className="ml-2 font-roboto font-semibold xl:text-xl text-lg">{user.name || 'No name'}</h5>
            </div>
            <div className="text-gray-50 md:text-lg text-sm">
                <p>{discussion.content}</p>
            </div>
            <div className="flex items-center mt-1">
                <span className="text-gray-300 md:text-md text-sm">{formatedDate}</span>
            </div>
        </div>
    );
};
