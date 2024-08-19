import { allPosts } from "contentlayer/generated";
import { CompactPostItemContainer } from "./post-item";
import { orderBy } from "lodash";

export const BlogList = (props: any) => {
  const posts = orderBy(allPosts, ['publishedDate'], ['desc']).filter((post) => post.isPublished)
  return (
    <>
      <div className="relative flex flex-col h-full w-full">
        <BlogListTitle />
        <div className="flex flex-row w-full justify-center h-fit">
        <div className="mt-2 md:mt-20 mx-2 md:mx-10 bg-zinc-900 md:gap-5 p-2 md:p-10 flex flex-col w-full justify-center items-center rounded-2xl bg-opacity-90 h-min z-10 gap-7">
          {posts.map((post, index) => (
            <CompactPostItemContainer key={index} post={post as any} />
          ))}
        </div>
        </div>
      </div>
    </>
  );
};

export const BlogListTitle = (props: any) => {
  return (
    <>
      <div id={"blogs"} className="flex w-full flex-col xl:mx-10 mx-4">
        <span className="font-head md:text-6xl text-3xl tracking-wider text-white">
          We're writing blogs every week
        </span>
        <div className="flex bg-yellow-400 md:p-5 p-1 mt-5 w-[97vw] flex-col">
          <span className="font-roboto text-sm md:text-lg text-black px-2">
            We're creating software product, we would love to share with you all
            knowledge during our journey
          </span>
        </div>
        <div className="flex flex-row items-start md:mt-52 w-[95%]">
          <div className="h-full -rotate-90 md:w-28 w-16 mt-16 overflow-visible flex flex-col justify-start items-center ml-[-15px]">
            <div className="border-b-4 pb-1 border-yellow-500 md:w-[330px] w-[120px]">
              <h2 className="font-head text-2xl md:text-7xl px-2">
                Topics we write
              </h2>
            </div>
          </div>
          <div className="flex flex-col md:gap-5 gap-2 md:h-64 h-32 items-start mt-10 min-w-fit">
            <span className="font-head text-xl md:text-5xl">System design</span>
            <span className="font-head text-xl md:text-5xl">
              Mobile development
            </span>
            <span className="font-head text-xl md:text-5xl">
              Web development
            </span>
          </div>
          <div className="flex flex-row w-full justify-end md:h-[250px] h-[150px] items-end">
            <div className="bulb-position h-[50px] w-[50px] md:mb-20 mb-5 xl:mr-64 md:mr-28 mr-5"/>
          </div>
        </div>
      </div>
    </>
  );
};
