import React from 'react';

export const DiscussionInput = () => {
    return (
        <div className="bg-black border border-blue-500 rounded-md p-2 mb-4">
            <div contentEditable="true" className="w-full h-full min-h-[40px] mb-2 outline-none">
                <p>Hi <a className="text-blue-500">@Jo</a></p>
            </div>
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <div className="flex items-center space-x-2">
                    <button className="btn"><i className="ri-bold"></i></button>
                    <button className="btn"><i className="ri-italic"></i></button>
                    <button className="btn"><i className="ri-underline"></i></button>
                    <button className="btn"><i className="ri-list-unordered"></i></button>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="btn"><i className="ri-at-line"></i></button>
                    <button className="btn primary bg-blue-500 text-white px-8 py-1 rounded-md">Send</button>
                </div>
            </div>
        </div>
    );
};
