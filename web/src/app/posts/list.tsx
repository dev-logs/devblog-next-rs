import {allPosts} from "contentlayer/generated";
import {CompactPostItemContainer} from "./post-item";
import {orderBy} from "lodash";
import {ThreeDCanvas} from "../components/canvas";
import {ElectricalEffect} from "../components/electrical-effect";
import {Reponsive, reponsiveMatch, WidthReponsive} from "../components/reponsive";
import {Fragment} from "react";
import {Container, MainContainer} from "../components/container";
import {Environment} from "@react-three/drei";

export const BlogList = (props: any) => {
    const posts = orderBy(allPosts, ['publishedDate'], ['desc']).filter((post) => post.isPublished)
    return (
        <>
            <div className="relative flex flex-col h-full w-full">
                <div className="absolute left-0 top-0 bulb-position z-10 h-full w-full">
                    <ThreeDCanvas gl={{alpha: true}}>
                        <Environment files={`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/warehouse.hdr`}/>
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
                                                position={[1.4, 1.6, 0]}
                                                rotation-x={0.3}
                                                scale={12}/>
                                        }
                                        {
                                            match.is(WidthReponsive.VERY_LARGE) &&
                                            <ElectricalEffect
                                                position={[2, 1.6, 0]}
                                                rotation-x={0.3}
                                                scale={14}/>
                                        }
                                        {
                                            match.is(WidthReponsive.XX_LARGE) &&
                                            <ElectricalEffect
                                                position={[2.5, 1.5, 0]}
                                                rotation-x={0.3}
                                                scale={16}/>
                                        }
                                    </Fragment>
                                </>
                            }}
                        </Reponsive>
                    </ThreeDCanvas>
                </div>
                <BlogListTitle/>
                <div className="flex flex-row w-full justify-center h-fit">
                    <div
                        className="mt-2 md:mt-20 bg-zinc-900 md:gap-5 flex flex-col w-full justify-center items-center py-5 bg-opacity-90 h-min z-10 gap-7">
                        {posts.map((post, index) => (
                            <CompactPostItemContainer key={index} post={post as any}/>
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
        <div id={"blogs"} className="flex container w-full flex-col text-white">
        <span className="font-head md:text-6xl text-3xl tracking-wider text-white">
          We're writing blogs every week
        </span>
          <div className="flex bg-yellow-400 flex-col">
            <span className="h-fit flex items-center font-roboto text-sm md:text-lg text-black container py-1">
              We're creating software product, we would love to share with you all
              knowledge during our journey
            </span>
          </div>
                <div className="flex flex-row md:mt-52 mt-20 items-start w-[95%] h-full">
                    <div
                        className="-rotate-90 md:-translate-x-32 -translate-x-10 mt-16 lg:-mr-52 md:-mr-48 -mr-16 border-b-4 pb-1 border-yellow-500 md:w-[330px] w-[120px]">
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
