import {Fragment, Suspense, useEffect, useMemo, useRef, useState} from "react"
import {ThreeDCanvas} from "../components/canvas"
import {BlogList} from "../posts/list"
import {BasicInteraction} from "../components/basic-interaction"
import {RunningText} from "../components/running-text"
import {FooterHtml} from "../components/footer"
import {TASKS} from "@/app/home/index"
import dynamic from "next/dynamic"
import { Toaster } from "react-hot-toast"
import { HomeBackground } from "./background"

export default function HomeContent(props: any) {
  const [totalPages, setTotalPages] = useState(1)
  return <_Home {...props} totalPages={totalPages}/>
}

const _Home = (props: any) => {
    const {tasks} = props || {}
    const Header3dLazy = dynamic(() => tasks[TASKS.HEADER_3D])
    return (
        <>
           <HomeBackground className="flex flex-col h-full w-full">
              <Toaster position="bottom-right"/>
              <div className="w-screen h-auto">
                <div className="flex flex-col w-screen left-0 top-0 z-20">
                  <div className="h-screen w-screen">
                    <ThreeDCanvas gl={{alpha: true}}>
                      <Suspense>
                        <Header3dLazy/>
                      </Suspense>
                    </ThreeDCanvas>
                  </div>
                  <HtmlDoms/>
                </div>
              </div>
            </HomeBackground>
        </>
    );
};

const HtmlDoms = () => {
    return <div className="mr-5 w-screen flex flex-col gap-14">
      <BlogList/>
      <RunningText/>
      <BasicInteraction/>
      <div>
        <FooterHtml/>
      </div>
    </div>
}

