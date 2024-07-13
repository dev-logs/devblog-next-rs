'use client'
import dynamic from "next/dynamic"
import {Suspense, useCallback} from "react"
import {LoadingOverlay} from "@/app/components/loading-overlay"

export const TOTAL_PAGES = 5

const getTasks = () => [
    import('../posts/blog-list-background'),
    import('./header3d')
]

export const TASKS = {
  BLOG_LIST_BACKGROUND_TASK: 0,
  HEADER_3D: 1
}

export default function Home(props: any) {
    const loadHomePage = import('./content')
    const tasks = getTasks()
    const HomeContentDynamic = dynamic(() => loadHomePage)

    return <div>
      <LoadingOverlay tasks={[loadHomePage, ...tasks]}/>
        <Suspense>
            <HomeContentDynamic tasks={tasks} />
        </Suspense>
    </div>
}
