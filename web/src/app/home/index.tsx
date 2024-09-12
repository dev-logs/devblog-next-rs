import React from "react"
import HomeContent from "./content"
import { LoadingOverlay } from "../components/loading-overlay"
import {NavigationBar} from "@/app/components/navigation-bar";

export default function Home() {
    return <React.StrictMode>
        <div className="h-screen">
          <NavigationBar dynamicColor />
          <div className={"fixed top-0 left-0 z-10 h-full"}>
            <LoadingOverlay tasks={[]}/>
          </div>
          <div className={`absolute top-0 left-0 z-0`}>
            <HomeContent/>
          </div>
        </div>
    </React.StrictMode>
}

