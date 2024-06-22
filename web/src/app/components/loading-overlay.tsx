'use client'

import {useEffect, useRef, useState} from "react";
import {useProgress} from "@react-three/drei";
import gsap from "gsap";
import noop from 'lodash/noop'

export const LoadingOverlay = (props: any) => {
    const {
        tasks = [],
        onComplete = noop
    }: any = props || {}

    const [progress, updateProgress] = useState(0)
    const [htmlProgress, updateHtmlProgress] = useState(0)
    const {active, progress: modelProgress, errors, item, loaded, total} = useProgress()

    const [isComplete, updateComplete] = useState(false)

    useEffect(() => {
        const unit = 1 / tasks.length
        const progress = {value: 0}
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].finally(() => {
                progress.value += unit
                updateHtmlProgress(progress.value)
            })
        }
    }, [tasks, tasks.length]);

    useEffect(() => {
        let mProgress = (loaded / total) + (modelProgress * 0.01 / total)
        console.log(mProgress)
        if (isNaN(mProgress)) mProgress = 0

        const finalProgress = (mProgress + htmlProgress) / 2
        updateProgress(Number(finalProgress.toFixed(2)))
    }, [modelProgress, htmlProgress, total, loaded]);

    const progressBarRef: any = useRef(null)
    const backgroundRef: any = useRef(null)

    useEffect(() => {
        if (!progressBarRef.current || !backgroundRef.current) return
        const progressBar = progressBarRef.current
        const background = backgroundRef.current

        if (progress >= 1) {
            window.setTimeout(() => {
                progressBar.style.transform = 'scaleX(0)'
                progressBar.style.transformOrigin = '100% 0'
                progressBar.style.transition = 'transform 1.5s ease-in-out'

                gsap.to(background, {
                    opacity: 0,
                    duration: 3,
                    delay: 1,
                    onComplete: () => updateComplete(true)
                })
            }, 500)
        } else {
            progressBar.style.transform = `scaleX(${progress})`
        }
    }, [progress]);

    if (isComplete) {
        onComplete()
        return <></>
    }

    return <>
        <div
            ref={backgroundRef}
            className={"absolute z-50 top-0 left-0 h-screen w-screen bg-black justify-center items-center flex flex-col"}>
            <span className={"font-graduate text-1xl"}>Loading, please wait...</span>
            <div
                ref={progressBarRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    width: '100%',
                    height: '2px',
                    background: '#ffffff',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.5s',
                    transformOrigin: 'top left'
                }}
            />
            {progress}
        </div>
    </>
}
