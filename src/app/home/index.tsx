"use client";

import {Fragment, useMemo, useRef} from "react";
import * as THREE from "three";
import {Html, Scroll, useScroll} from "@react-three/drei";
import {LowVertexModel} from "../models/low-vertex";
import {ThreeDCanvas} from "../components/canvas";
import {NavigationBar} from "../components/navigation-bar";
import {BlogList, BlogListBackground} from "../posts/list";
import {useFrame} from "@react-three/fiber";
import {Tivi} from "../components/tivi";
import {BasicInteraction} from "../components/basic-interaction";
import {RunningText} from "../components/running-text";
import {Ribbon} from "../components/ribbon";
import {HomeBackground} from "./background";
import {FooterHtml} from "../components/footer";
import Stats from 'stats.js';
import {Reponsive} from "../components/reponsive"

export const TOTAL_PAGES = 5

export interface HomeProps {
    totalPages: number | 0
}

export const Home = (props: any) => {
    return <Reponsive>
        {(matches: any) => <Fragment>
            {matches.small && matches.short && <_Home totalPages={4}/>}
            {matches.small && !matches.short && <_Home totalPages={3.8}/>}
            {!matches.small && <_Home totalPages={4.2}/>}
        </Fragment>}
    </Reponsive>
}

const _Home = (props: HomeProps) => {
    const footer3dRef = useRef(null)
    return (
        <>
            <div className="flex flex-col bg-black">
                <div className="flex w-screen h-screen z-0">
                    <ThreeDCanvas
                        gl={{alpha: true, antialias: false}}
                        scroll={{infinite: false, pages: props.totalPages, maxSpeed: 1.1}}>
                        <Header3d/>
                        <Scroll>
                            <BlogListBackground/>
                        </Scroll>
                        <Scroll>
                            <HtmlDoms footer3dRef={footer3dRef}/>
                        </Scroll>
                        <Scroll>
                        </Scroll>
                    </ThreeDCanvas>
                </div>
            </div>
        </>
    );
};

const HtmlDoms = (props: any) => {
    const scrollData = useScroll()
    return <Html portal={{current: scrollData.fixed}} occlude={"blending"}>
        <div className="absolute top-[-50vh] left-[-50vw] w-screen h-[200vh]">
            <ThreeDCanvas orthographic camera={{zoom: 100}} performance={{min: 0, max: 0}}>
                <HomeBackground scrollData={scrollData}/>
            </ThreeDCanvas>
        </div>
        <div
            className="absolute top-[-70vh] md:top-[-75vh] left-[-50vw] flex flex-col gap-10 items-center p-2 w-screen h-screen justify-center">
            <span className="xl:text-8xl md:text-4xl text-2xl font-graduate text-center text-black">DEVLOGS STUDIO, CREATIVE SOFTWARE DESIGN</span>
        </div>
        <div className="absolute top-[50vh] left-[-50vw] mr-5 w-screen flex flex-col gap-14">
            <BlogList/>
            <RunningText/>
            <div className="xl:mx-10 mx-4">
                <BasicInteraction/>
            </div>
            <div>
                <FooterHtml scrollData={scrollData} footer3dRef={props.footer3dRef}/>
            </div>
            <div className="h-96"></div>
        </div>
    </Html>
}

export const Header3d = (props: any) => {
    const stats = useMemo(() => {
        const stats = new Stats()
        stats.showPanel(0)
        document.body.appendChild(stats.dom)
        return stats
    }, [])

    useFrame(() => {
        stats.begin()
        stats.end()
    })

    const airplaneRef: any = useRef(null);
    const scroll = useScroll()
    useFrame((tick: any) => {
        const scrollRange = scroll.range(0, 1)
        const clock = tick.clock;
        const elapsedTime = clock.getElapsedTime();
        if (airplaneRef.current) {
            airplaneRef.current.position.x = Math.sin(elapsedTime) * 4 * 0.7;
            airplaneRef.current.position.y = Math.cos(elapsedTime) * 4 * 0.2;
            airplaneRef.current.position.z = Math.cos(elapsedTime) * 4 * 0.4;

            airplaneRef.current.rotation.y = elapsedTime;
            airplaneRef.current.rotation.x = Math.sin(elapsedTime * 2) * 0.8;
            airplaneRef.current.rotation.z = Math.cos(elapsedTime * 2) * 0.1;

            airplaneRef.current.position.y += scrollRange * 30
        }
    });

    return (
        <>
            <Reponsive>
                {(matches: any) => (
                    <Fragment>
                        {matches.small && <>
                            <LowVertexModel
                                ref={airplaneRef}
                                material={
                                    new THREE.MeshBasicMaterial({
                                        color: "#F05454",
                                        side: THREE.DoubleSide
                                    })
                                }
                                name="paper-airplane"
                                scale={2}
                                position={[2, -4, -1]}
                            />
                            <Scroll>
                                <Tivi
                                    scale={7}
                                    position={[0, -1.5, -1]}/>
                                <Ribbon
                                    position={[0, -1, -0.7]}
                                    scale={1.5}/>
                            </Scroll>
                        </>}
                        {matches.medium && <>
                            <LowVertexModel
                                ref={airplaneRef}
                                material={
                                    new THREE.MeshBasicMaterial({
                                        color: "#F05454",
                                        side: THREE.DoubleSide
                                    })
                                }
                                name="paper-airplane"
                                scale={3}
                                position={[2, -3, -1]}
                            />
                            <Scroll>
                                <Tivi
                                    scale={9}
                                    position={[0, -2.5, -1]}/>
                                <Ribbon
                                    position={[0, -1.8, -1.1]}
                                    scale={2.5}/>
                            </Scroll>
                        </>
                        }
                    </Fragment>
                )}
            </Reponsive>
        </>
    );
};

export const HeaderHtml = (props: any) => {
    return (
        <>
            <div className="flex flex-col h-screen w-screen justify-between">
                <NavigationBar/>
                <div className="flex flex-row justify-center items-center">
                    <span className="font-roboto text-[160px] font-black">DEVLOGS</span>
                    <div className="bg-green-400 rounded-lg py-2 px-3 gap-0 flex flex-col justify-center items-center">
                        {"s t u d i o".split(" ").map((c) => (
                            <p className="font-roboto text-sm">{c}</p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
