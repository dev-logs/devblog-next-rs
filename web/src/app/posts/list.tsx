import { allPosts } from "contentlayer/generated";
import { CompactPostItemContainer } from "./post-item";
import { orderBy } from "lodash";
import { ThreeDCanvas } from "../components/canvas";
import { ElectricalEffect } from "../components/electrical-effect";
import { Reponsive, reponsiveMatch, WidthReponsive } from "../components/reponsive";
import { Fragment } from "react";

export const BlogList = (props: any) => {
  const posts = orderBy(allPosts, ['publishedDate'], ['desc']).filter((post) => post.isPublished)
  return (
    <>
      <div className="relative flex flex-col h-full w-full">
        <div className="absolute left-0 top-0 bulb-position z-10 h-full w-full">
         <ThreeDCanvas gl={{alpha: true}}>
            <Reponsive>
              {(matches: any) => {
                const match = reponsiveMatch(matches)
                return <>
                  <Fragment>
                    {
                        (match.is(WidthReponsive.SMALL) || match.is(WidthReponsive.MEDIUM)) && 
                          <ElectricalEffect
                            position={[1, 1.8, 0]}
                            rotation-x={0.7}
                            scale={10}/>
                    }
                    {
                        match.is(WidthReponsive.LARGE) && 
                          <ElectricalEffect
                            position={[1.2, 2, 0]}
                            rotation-x={0.3}
                            scale={12}/>
                    }
                    {
                        match.is(WidthReponsive.VERY_LARGE) && 
                          <ElectricalEffect
                            position={[1.8, 2, 0]}
                            rotation-x={0.3}
                            scale={13}/>
                    }
                    {
                        match.is(WidthReponsive.XX_LARGE) && 
                          <ElectricalEffect
                            position={[3, 2, 0]}
                            rotation-x={0.3}
                            scale={16}/>
                    }
                  </Fragment>
                </>
              }}
            </Reponsive>
          </ThreeDCanvas>
        </div>
        <BlogListTitle />
        <div className="flex flex-row w-full justify-center h-fit">
        <div className="mt-2 md:mt-20 bg-zinc-900 md:gap-5 p-2 md:p-10 flex flex-col w-full justify-center items-center rounded-2xl bg-opacity-90 h-min z-10 gap-7">
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
      <div id={"blogs"} className="flex w-full flex-col text-white">
        <span className="font-head md:text-6xl text-3xl tracking-wider text-white">
          We're writing blogs every week
        </span>
        <div className="flex bg-yellow-400 md:p-5 p-1 mt-5 w-[97vw] flex-col">
          <span className="font-roboto text-sm md:text-lg text-black px-2">
            We're creating software product, we would love to share with you all
            knowledge during our journey
          </span>
        </div>
        <div className="flex flex-row md:mt-52 mt-20 items-start w-[95%] h-full">
            <div className="-rotate-90 md:-translate-x-28 -translate-x-10 mt-16 md:-mr-40 -mr-14 border-b-4 pb-1 border-yellow-500 md:w-[330px] w-[120px]">
              <h2 className="font-head text-2xl md:text-7xl px-2">
                Topics we write
              </h2>
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
        </div>
        </div>
    </>
  );
};
