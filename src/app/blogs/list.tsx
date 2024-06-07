import { Html, OrbitControls, Scroll } from "@react-three/drei"
import { ThreeDCanvas } from "../components/canvas"
import { ElectricalEffect } from "../components/electrical-effect"
import { DeployFlutterWebBlogItem } from "./deploy-flutter-web/item"

export const BlogList = (props: any) => {
  return <>
    <div className="relative flex flex-col h-full w-full">
      <BlogListTitle/>
      <div className="mt-2 md:mt-20 mx-2 md:mx-10 bg-zinc-900 gap-2 md:gap-5 p-2 md:p-10 grid md:grid-cols-3 grid-cols-1 rounded-2xl bg-opacity-60 h-full z-10">
        <DeployFlutterWebBlogItem/>
        <DeployFlutterWebBlogItem/>
      </div>
    </div>
  </>
}

export const BlogListBackground = (props: any) => {
  return <>
    <ElectricalEffect {...props}/>
  </>
}

export const BlogListTitle = (props: any) => {
  return <>
    <div className="flex w-full flex-col m-4">
      <span className="font-head md:text-6xl text-3xl tracking-wider text-white">We're writing blogs every week</span>
      <div className="flex bg-yellow-400 p-5 mt-5 w-full flex-col">
        <span className="font-graduate text-sm md:text-lg text-black">We're creating software product, we would love to share with you all knowledge during our journey</span>
        <span className="font-graduate text-sm md:text-lg text-black">With high quality of skill sets</span>
      </div>
      <div className="flex flex-row items-center md:mt-52">
        <div className="h-full -rotate-90 md:w-28 w-20 overflow-visible flex flex-col justify-center items-center">
          <div className="border-b-4 pb-2 border-yellow-500 md:w-[330px] w-[120px]">
            <h2 className="font-head text-3xl md:text-7xl">Topics we write</h2>
          </div>
        </div>
        <div className="flex flex-col gap-5 h-64 justify-center">
          <span className="font-head text-xl md:text-5xl">System design</span>
          <span className="font-head text-xl md:text-5xl">Mobile development</span>
          <span className="font-head text-xl md:text-5xl">Web development</span>
        </div>
      </div>
    </div>
  </>
}
