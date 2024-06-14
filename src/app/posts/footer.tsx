import {ThreeDCanvas} from "@/app/components/canvas";
import {PostBackground} from "@/app/posts/background";
import {FooterHtml} from "@/app/components/footer";
import {Discussions} from "@/app/components/discussion";

export const PostFooter = (props: any) => {
    const {discussions} = props || {}
    return <div className="relative w-full h-full">
        <div
            className="absolute left-0 top-0 bg-gradient-to-b z-10 from-black w-screen h-[80vh]"
        />
        <div className="w-screen h-[200vh]">
            <ThreeDCanvas gl={{alpha: false, antialias: false}}>
                <PostBackground/>
            </ThreeDCanvas>
        </div>
        <div className="absolute top-20 left-0 w-full h-fit z-20 flex flex-col items-center">
            <Discussions discussions={discussions} totalComments={discussions.length}/>
            <FooterHtml/>
        </div>
    </div>
}
