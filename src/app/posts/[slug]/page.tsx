import {Suspense} from "react";
import dynamic from "next/dynamic";

const PostPageContent = dynamic(() => import("@/app/posts/[slug]/content"), {ssr: false})

export default function PostPage(props: any) {
    return <div>
        <Suspense fallback={<span>Loading started</span>}>
            {/*<PostPageContent {...props}/>*/}
        </Suspense>
    </div>
}
