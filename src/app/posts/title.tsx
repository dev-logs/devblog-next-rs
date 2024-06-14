import {Post} from "contentlayer/generated"
import Image from "next/image"

export const PostTitle = (props: any) => {
    const {post}: { post: Post } = props || {}
    return <>
        <div className="relative w-full h-screen bg-black bg-opacity-15 backdrop-blur-3xl">
            <div className="absolute top-0 left-0 flex flex-col w-full h-full justify-center items-center">
                <span
                    className="lg:text-7xl md:text-4xl text-3xl text-center font-bold font-graduate text-gray-200">{post.title}</span>
            </div>
        </div>
    </>
}
