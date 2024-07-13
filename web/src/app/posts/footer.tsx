import { ThreeDCanvas } from "@/app/components/canvas";
import { PostBackground } from "@/app/posts/background";
import { FooterHtml } from "@/app/components/footer";
import { Discussions } from "@/app/components/discussion";

export default function PostFooter(props: any) {
  const { discussions, post } = props || {};
  return (
    <div className="app-footer relative w-full h-full">
      <div className="absolute left-0 top-0 bg-gradient-to-b z-10 from-black w-screen h-[200vh]" />
      <div className="absolute left-0 top-0 bg-gradient-to-b z-10 from-black w-screen h-[10vh]" />
      <div className="absolute left-0 top-0 z-10 bg-black bg-opacity-25 backdrop-blur-3xl from-black w-screen h-[200vh]" />
      <div className="absolute top-0 left-0 z-0 w-screen h-full">
        <ThreeDCanvas gl={{ alpha: false, antialias: false }} dpr={1}>
          <PostBackground />
        </ThreeDCanvas>
      </div>
      <div className="w-full h-fit z-20 flex flex-col items-center gap-10">
        <Discussions
          discussions={discussions}
          totalComments={discussions.length}
          post={post}
        />
        <FooterHtml />
      </div>
    </div>
  );
}
