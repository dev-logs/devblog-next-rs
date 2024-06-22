'use client'
import React, {Suspense, useCallback, useMemo, useState} from "react";
import dynamic from "next/dynamic";
import PostPageContent from "@/app/posts/[slug]/content";
import {LoadingOverlay} from "@/app/components/loading-overlay";
import {getTask} from "@/app/posts/[slug]/config";
import {hidden} from "kleur/colors";


export default function PostPage(props: any) {
    const tasks = useMemo(() => getTask(), [])
    const [display, updateDisplay] = useState(false)

    return <div className={'h-screen'}>
        <div className={"fixed top-0 left-0 z-10 h-full"}>
            <LoadingOverlay tasks={tasks}/>
        </div>
        <div className={`absolute top-0 left-0 z-0`}>
            <PostPageContent {...props} tasks={tasks}/>
        </div>
    </div>
}
