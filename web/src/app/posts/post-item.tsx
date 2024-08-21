import {Post} from "contentlayer/generated"
import Link from "next/link";
import { useCallback } from "react";

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
                    className="aspect-auto md:w-full bg-opacity-10 object-cover overflow-clip rounded-xl h-[200px] md:h-[300px] w-[30vw]"
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

export const CompactPostItemContainer = (props: PostItemProps) => {
    const {post} = props
    const date = new Date(post.publishedDate || new Date())
    const onClick = useCallback(() => {
      window.location.href = post.url
    }, [post])

    return <div className="col-span-1">
        <div
          className="hover:cursor-pointer flex px-5 flex-row rounded-xl py-5 min-w-[300px] w-full items-center max-w-[900px] gap-5 hover:bg-black" onClick={onClick}>
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold text-4xl">{date.getDate()}</span>
            <span>{date.getMonth() + 1}/{date.getFullYear()}</span>
          </div>
          <div className="flex flex-col h-full justify-start ml-5 gap-5">
            <img src={post.publicImage} className="w-[100vw] h-[100px] md:h-[250px] md:mb-2 object-cover rouned-xl overflow-clip"/>
            <div className="flex flex-col md:gap-2 flex-1">
              <span className="font-roboto md:font-bold uppercase text-white font-bold text-sm md:text-2xl">{post.title}</span>
              <span className="font-roboto text-white text-sm md:text-xl">{post.description}</span>
              <span className="mt-4 text-gray-300">{post.readingTime.text}</span>
            </div>
          </div>
        </div>
    </div>
}
