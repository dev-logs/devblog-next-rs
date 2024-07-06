"use client";

import {Fragment, Suspense, useRef} from "react";
import {Html, Scroll, useScroll} from "@react-three/drei";
import {ThreeDCanvas} from "../components/canvas";
import {NavigationBar} from "../components/navigation-bar";
import {BlogList} from "../posts/list";
import {BasicInteraction} from "../components/basic-interaction";
import {RunningText} from "../components/running-text";
import {HomeBackground} from "./background";
import {FooterHtml} from "../components/footer";
import {Reponsive} from "../components/reponsive"
import {TASKS} from "@/app/home/index";
import dynamic from "next/dynamic";
import { VoteForNextTopic } from "../components/vote-next-topic";

export default function HomeContent(props: any) {
    return <Reponsive>
        {(matches: any) => <Fragment>
            {matches.small && matches.short && <_Home {...props} totalPages={4}/>}
            {matches.small && !matches.short && <_Home {...props} totalPages={3.8}/>}
            {!matches.small && <_Home {...props} totalPages={4.2}/>}
        </Fragment>}
    </Reponsive>
}

const _Home = (props: any) => {
    const {tasks} = props || {}
    const BlogListBackgroundLazy = dynamic(() => tasks[TASKS.BLOG_LIST_BACKGROUND_TASK])
    const Header3dLazy = dynamic(() => tasks[TASKS.HEADER_3D])

    const footer3dRef = useRef(null)
    return (
        <>
            <div className="flex flex-col bg-black">
                <div className="flex w-screen h-screen z-0">
                    <ThreeDCanvas
                        gl={{alpha: true, antialias: false}}
                        scroll={{infinite: false, pages: props.totalPages, maxSpeed: 1.1}}>
                        <Suspense>
                            <Header3dLazy/>
                        </Suspense>
                        <Scroll>
                            <Suspense>
                                <BlogListBackgroundLazy/>
                            </Suspense>
                        </Scroll>
                        <Scroll>
                            <HtmlDoms footer3dRef={footer3dRef}/>
                        </Scroll>
                        <Scroll>
                        </Scroll>
                    </ThreeDCanvas>
                </div>
            </div>
        </>
    );
};

const HtmlDoms = (props: any) => {
    const scrollData = useScroll()
    return <Html portal={{current: scrollData.fixed}} occlude={"blending"}>
        <div className="absolute top-[-50vh] left-[-50vw] w-screen h-[200vh]">
            <ThreeDCanvas orthographic camera={{zoom: 100}} performance={{min: 0, max: 0}}>
                <HomeBackground scrollData={scrollData}/>
            </ThreeDCanvas>
        </div>
        <div
            className="absolute top-[-70vh] ml-10 gap-3 left-[-50vw] h-screen flex justify-center items-start flex-col">
            <div
                className="flex flex-row gap-2 md:w-fit lg:gap-2 w-screen h-fit justify-start items-start">
                <span
                    className="xl:text-2xl col-span-1 px-4 w-fit text-1xl font-graduate bg-pink-700 bg-opacity-25 p-2 rounded-full text-center h-fit text-black">THE</span>
                <span
                    className="xl:text-2xl col-span-5 w-fit text-1xl font-graduate bg-black bg-opacity-25 p-2 text-center h-fit text-white">DEVLOG STUDIO</span>
            </div>
            <div
                className="flex flex-row gap-2 md:w-fit lg:gap-2 w-screen h-fit justify-start items-start">
                <span
                    className="xl:text-2xl md:text-2xl col-span-2 w-fit text-1xl font-graduate bg-blue-400 bg-opacity-15 p-2 px-1 text-center h-fit text-black">THE CREATIVE</span>
                <span
                    className="xl:text-2xl text-1xl col-span-3 w-fit font-graduate bg-black bg-opacity-15 p-2 px-1 h-fit text-center text-black">SOFTWARE DEVELOPMENT</span>
            </div>
        </div>
        <div className="absolute top-[50vh] left-[-50vw] mr-5 w-screen flex flex-col gap-14">
            <BlogList/>
            <RunningText/>
            <div className="xl:mx-10 mx-4">
                <BasicInteraction/>
            </div>
            <div>
                <FooterHtml scrollData={scrollData} footer3dRef={props.footer3dRef}/>
            </div>
            <div>
              <VoteForNextTopic/>
            </div>
            <div className="h-96"></div>>
        </div>
    </Html>
}


export const HeaderHtml = (props: any) => {
    return (
        <>
            <div className="flex flex-col h-screen w-screen justify-between">
                <NavigationBar/>
                <div className="flex flex-row justify-center items-center">
                    <span className="font-roboto text-[160px] font-black">DEVLOGS</span>
                    <div className="bg-green-400 rounded-lg py-2 px-3 gap-0 flex flex-col justify-center items-center">
                        {"s t u d i o".split(" ").map((c) => (
                            <p className="font-roboto text-sm">{c}</p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
