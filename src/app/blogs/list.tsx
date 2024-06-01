import { OrbitControls } from "@react-three/drei"
import { ThreeDCanvas } from "../components/canvas"
import { ElectricalEffect } from "../components/electrical-effect"
import { DeployFlutterWebBlogItem } from "./deploy-flutter-web/item"

export const BlogList = (props: any) => {
  return <>
    <div className="relative flex flex-col h-full w-full">
      <div className="mt-20 mx-20 bg-zinc-900 gap-5 p-10 grid grid-cols-3 rounded-2xl bg-opacity-60 h-full z-10">
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
