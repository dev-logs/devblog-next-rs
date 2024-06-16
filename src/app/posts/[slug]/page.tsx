'use client'
import React, {Suspense} from "react";
import dynamic from "next/dynamic";
import PostPageContent from "@/app/posts/[slug]/content";
import {LoadingOverlay} from "@/app/components/loading-overlay";
import {getTask} from "@/app/posts/[slug]/config";


export default function PostPage(props: any) {
    const tasks = getTask()

    return <div>
        <LoadingOverlay tasks={tasks}/>
        <PostPageContent {...props} tasks={tasks}/>
    </div>
}
