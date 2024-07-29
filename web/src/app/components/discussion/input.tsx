import { useAuthentication, useAuthenticationPopup } from '@/app/hooks/authentication'
import { useService } from '@/app/hooks/service'
import { Post } from 'contentlayer/generated'
import React, {useCallback, useEffect} from 'react'

export const DiscussionInput = ({ post, onSent }: { post: Post, onSent: () => void}) => {
    const {requestUser, popupComponent, user} = useAuthentication()
    const newDiscussion = useService().discussion().newDiscussion()
    const getUser = useService().auth().getCurrentUser()
    const signout = useService().auth().signout()

    useEffect(() => {
      newDiscussion.setTitle(post.title)
    }, [])

    useEffect(() => {
      if (newDiscussion.data) {
        newDiscussion.setContentState('')
        newDiscussion.updateData(null)
      }
    }, [newDiscussion.data, newDiscussion.setContent, newDiscussion.updateData])

    const sendHandler = useCallback(() => {
      if(requestUser()) {
        newDiscussion.trigger().then(() => {
          onSent()
        })
      }
    }, [onSent, newDiscussion])

    useEffect(() => {
      getUser.trigger()
      if (signout.data) {
        signout.updateData(false)
      }
    }, [requestUser, user, signout.data])

    return <div className='flex flex-col h-fit'>
        {popupComponent}
        { getUser.data &&
          <div className='flex flex-row sm:text-lg text-xs font-roboto bg-blue-700 rounded-t-md w-fit px-1 gap-1'>
            <span className='text-white font-bold'>{getUser.data.getName() ?? getUser.data.getEmail()}</span>
            <button className='font-mono text-blue-200' onClick={signout.trigger}>&#10006;</button>
          </div>
        }
        <div className="bg-black border border-blue-500 rounded-b-md rounded-tr-md p-2 mb-4 font-roboto">
            <textarea
              value={newDiscussion.contentState}
              onChange={(e) => {newDiscussion.setContentState(e.target.value)}}
              className="w-full h-fit font-roboto focus:border-none border-none mb-2 outline-none bg-transparent bg-opacity-0">
            </textarea>
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <div className="flex items-center space-x-2">
                    <button className="btn"><i className="ri-bold"></i></button>
                    <button className="btn"><i className="ri-italic"></i></button>
                    <button className="btn"><i className="ri-underline"></i></button>
                    <button className="btn"><i className="ri-list-unordered"></i></button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="btn"><i className="ri-at-line"></i></button>
                    <button disabled={newDiscussion.isLoading} onClick={sendHandler} className="btn disabled:bg-blue-300 primary bg-blue-500 text-white px-4 text-lg py-1 rounded-md">Send</button>
                </div>
            </div>
        </div>
    </div>
}
