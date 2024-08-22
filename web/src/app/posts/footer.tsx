'use client'
import { ThreeDCanvas } from "@/app/components/canvas";
import { PostBackground } from "@/app/posts/background";
import { FooterHtml } from "@/app/components/footer";

export default function PostFooter(props: any) {
  return (
    <div className="app-footer relative w-full h-full pt-20">
      <div className="absolute left-0 top-0 bg-gradient-to-b z-10 from-black w-screen h-[20vh]" />
      <div className="absolute top-0 left-0 z-0 w-screen h-full">
        <ThreeDCanvas gl={{ alpha: false, antialias: false }} dpr={1}>
          <PostBackground />
        </ThreeDCanvas>
      </div>
      <div className="w-full h-fit z-20 flex flex-col items-center gap-10">
        <FooterHtml />
      </div>
    </div>
  )
}
