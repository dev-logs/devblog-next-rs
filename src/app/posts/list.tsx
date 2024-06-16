import {allPosts} from "contentlayer/generated"
import {ClassicPostItemContainer} from "./post-item"

export const BlogList = (props: any) => {
    return <>
        <div className="relative flex flex-col h-full w-full">
            <BlogListTitle/>
            <div
                className="mt-2 md:mt-20 mx-2 md:mx-10 bg-zinc-900 md:gap-5 p-2 md:p-10 grid md:grid-cols-2 xl:grid-cols-3 gap-2 grid-cols-1 rounded-2xl bg-opacity-60 h-fit z-10">
                {allPosts.map((post) => <ClassicPostItemContainer post={post as any}/>)}
            </div>
        </div>
    </>
}

export const BlogListTitle = (props: any) => {
    return <>
        <div className="flex w-full flex-col xl:mx-10 mx-4">
            <span
                className="font-head md:text-6xl text-3xl tracking-wider text-white">We're writing blogs every week</span>
            <div className="flex bg-yellow-400 md:p-5 p-1 mt-5 w-[97vw] flex-col">
        <span className="font-roboto text-sm md:text-lg text-black px-2">
          We're creating software product, we would love to share with you all knowledge during our journey
        </span>
            </div>
            <div className="flex flex-row items-start md:mt-52">
                <div
                    className="h-full -rotate-90 md:w-28 w-16 mt-16 overflow-visible flex flex-col justify-start items-center ml-[-15px]">
                    <div className="border-b-4 pb-1 border-yellow-500 md:w-[330px] w-[120px]">
                        <h2 className="font-head text-2xl md:text-7xl px-2">Topics we write</h2>
                    </div>
                </div>
                <div className="flex flex-col md:gap-5 gap-2 md:h-64 h-32 items-start mt-10">
                    <span className="font-head text-xl md:text-5xl">System design</span>
                    <span className="font-head text-xl md:text-5xl">Mobile development</span>
                    <span className="font-head text-xl md:text-5xl">Web development</span>
                </div>
            </div>
        </div>
    </>
}
