import { useAuthentication, useAuthenticationPopup } from '@/app/hooks/authentication'
import { useService } from '@/app/hooks/service'
import { Post } from 'contentlayer/generated'
import React, {useCallback, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast'

export const DiscussionInput = ({post}: {post: Post}) => {
    const {requestUser, popupComponent} = useAuthentication()
    const newDiscussion = useService().discussion().newDiscussion()

    useEffect(() => {
      newDiscussion.setTitle(post.title)
    }, [])

    const sendHandler = useCallback(() => {
      if(requestUser()) {
        newDiscussion.trigger()
      }
    }, [])

    return <div className='flex flex-col h-fit'>
        {popupComponent}
        <div className="bg-black border border-blue-500 rounded-md p-2 mb-4">
            <textarea onChange={(e) => {newDiscussion.setContent(e.target.value)}} className="w-full h-fit font-roboto focus:border-none border-none mb-2 outline-none bg-transparent bg-opacity-0">
            </textarea >
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <div className="flex items-center space-x-2">
                    <button className="btn"><i className="ri-bold"></i></button>
                    <button className="btn"><i className="ri-italic"></i></button>
                    <button className="btn"><i className="ri-underline"></i></button>
                    <button className="btn"><i className="ri-list-unordered"></i></button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="btn"><i className="ri-at-line"></i></button>
                    <button onClick={sendHandler} className="btn primary bg-blue-500 text-white px-8 py-1 rounded-md">Send</button>
                </div>
            </div>
        </div>
    </div>
}
