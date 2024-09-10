import React from "react"
import HomeContent from "./content"
import { LoadingOverlay } from "../components/loading-overlay"

export const TOTAL_PAGES = 5

export const TASKS = {
  HEADER_3D: 0
}

export default function Home() {
    return <React.StrictMode>
        <div>
          <LoadingOverlay tasks={[]}/>
          <HomeContent/>
        </div>
    </React.StrictMode>
}

