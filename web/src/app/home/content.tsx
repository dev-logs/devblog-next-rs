'use client'
import {BlogList} from "../posts/list"
import {BasicInteraction} from "../components/basic-interaction"
import {RunningText} from "../components/running-text"
import {FooterHtml} from "../components/footer"
import { Toaster } from "react-hot-toast"
import { HomeBackground } from "./background"
import Header3d from "./header3d"

export default function HomeContent(props: any) {
  return <_Home {...props}/>
}

const _Home = (props: any) => {
    const {tasks} = props || {}
    return (
        <>
           <HomeBackground className="flex flex-col h-full w-full">
              <Toaster position="bottom-right"/>
              <div className="w-screen h-auto">
                <div className="flex flex-col w-screen left-0 top-0 z-20">
                  <div className="container h-screen">
                    <Header3d/>
                  </div>
                  <HtmlDoms/>
                </div>
              </div>
            </HomeBackground>
        </>
    );
};

const HtmlDoms = () => {
    return <div className="w-screen flex flex-col gap-14">
      <BlogList/>
      <RunningText/>
      <BasicInteraction/>
      <FooterHtml/>
    </div>
}

