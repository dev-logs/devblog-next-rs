import {Post} from "contentlayer/generated"
import Link from "next/link";

export interface PostItemProps {
    post: Post
}

export const ClassicPostItemContainer = (props: PostItemProps) => {
    const {post} = props
    return <div className="col-span-1">
        <div
            className="flex flex-col md:space-y-3 bg-black rounded-xl md:justify-between overflow-clip p-5 md:min-h-[500px] xl:h-[700px] max-w-[600px]">
            <div className="flex md:flex-col flex-row">
                <img
                    className="aspect-auto md:w-full bg-opacity-10 rounded-xl object-cover md:rounded-t-xl h-[200px] md:h-[300px] w-[30vw]"
                    src={post.publicImage}/>
                <div className="flex flex-col mt-2 md:mt-5 ga-2 md:gap-5 mx-5 flex-1">
                    <span
                        className="font-roboto md:font-bold uppercase text-white font-bold text-sm md:text-2xl">{post.title}</span>
                    <span
                        className="font-roboto md:font-semibold text-white text-sm md:text-lg">{post.description}</span>
                </div>
            </div>
            <div className="flex flex-row justify-between md:mb-5 md:mx-5 pt-10 md:pt-20 items-center">
                <Link href={post.url}
                   className="font-roboto border-green-400 text-sm rounded-full border py-2 px-4">{"Read more ->"}</Link>
                <span className="font-roboto text-pink-400 text-sm">{`${post.readingTime.text}`}</span>
            </div>
        </div>
    </div>
}
