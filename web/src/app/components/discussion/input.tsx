import React, {useCallback} from 'react';
import DiscussionService from "@/app/services/new-discussion";

export const DiscussionInput = () => {
    const onClickHandler = useCallback(async () => {
        const service = new DiscussionService()
        await service.getDiscussions()
    }, [])

    return (
        <div className="bg-black border border-blue-500 rounded-md p-2 mb-4">
            <textarea className="w-full h-fit font-roboto focus:border-none border-none mb-2 outline-none bg-transparent bg-opacity-0">
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
                    <button onClick={onClickHandler} className="btn primary bg-blue-500 text-white px-8 py-1 rounded-md">Send</button>
                </div>
            </div>
        </div>
    );
};
