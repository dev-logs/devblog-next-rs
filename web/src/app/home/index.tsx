'use client'
import dynamic from "next/dynamic"
import React, {Suspense, useCallback} from "react"
import {LoadingOverlay} from "@/app/components/loading-overlay"

export const TOTAL_PAGES = 5

const getTasks = () => [
    import('./header3d'),
    new Promise((resolve, reject) => {
      setTimeout(resolve, 2000)
    })
]

export const TASKS = {
  HEADER_3D: 0
}

export default function Home(props: any) {
    const loadHomePage = import('./content')
    const tasks = getTasks()
    const HomeContentDynamic = dynamic(() => loadHomePage)

    return <React.StrictMode>
        <div>
          <LoadingOverlay tasks={[loadHomePage, ...tasks]}/>
            <Suspense>
                <HomeContentDynamic tasks={tasks} />
            </Suspense>
        </div>
    </React.StrictMode>
}
