'use client'
import {Fragment, useMemo, useRef} from "react"
import Stats from "stats.js"
import {useFrame} from "@react-three/fiber"
import {Environment} from "@react-three/drei"
import {Reponsive, reponsiveMatch, WidthReponsive} from "@/app/components/reponsive"
import {Tivi} from "@/app/components/tivi"
import {Ribbon} from "@/app/components/ribbon"
import {ThreeDCanvas} from "../components/canvas"
import {MainContainer} from "../components/container"

export default function Header3d(props: any) {
    return <>
        <div className="relative w-full h-full">
            <div className="absolute left-0 top-0 w-full h-full">
                <ThreeDCanvas gl={{alpha: true}}>
                    <ThreeD/>
                </ThreeDCanvas>
            </div>
            <div className="container absolute lg:top-1/3 top-1/4">
                <HtmlHeader/>
            </div>
        </div>
    </>
}

export function ThreeD(props: any) {
    const stats = useMemo(() => {
        if (process.env.NEXT_PUBLIC_PATH_PREFIX !== 'dev') {
            return null
        }

        const stats = new Stats()
        stats.showPanel(0)
        document.body.appendChild(stats.dom)
        return stats
    }, [])

    useFrame(() => {
        stats?.begin()
        stats?.end()
    })

    const airplaneRef: any = useRef(null);
    useFrame((tick: any) => {
        const clock = tick.clock;
        const elapsedTime = clock.getElapsedTime();
        if (airplaneRef.current) {
            airplaneRef.current.position.x = Math.sin(elapsedTime) * 4 * 0.7;
            airplaneRef.current.position.y = Math.cos(elapsedTime) * 4 * 0.3;
            airplaneRef.current.position.z = Math.cos(elapsedTime) * 4 * 0.4;

            airplaneRef.current.rotation.y = elapsedTime;
            airplaneRef.current.rotation.x = Math.sin(elapsedTime * 2) * 0.8;
            airplaneRef.current.rotation.z = Math.cos(elapsedTime * 2) * 0.1;
        }
    });

    return <>
        <Environment files={`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/warehouse.hdr`}/>
        <Reponsive>
            {(matches: any) => {
                const match = reponsiveMatch(matches)
                return <Fragment>
                    {(match.is(WidthReponsive.SMALL)) && <>
                        <Tivi
                            scale={5}
                            position={[0, -1.4, 1]}/>
                        <Ribbon
                            position={[0, -1.25, 1]}
                            scale={1.5}/>
                    </>}

                    {match.is(WidthReponsive.MEDIUM) && <>
                        <Tivi
                            scale={5}
                            position={[0, -1.4, 1]}/>
                        <Ribbon
                            position={[0, -1.25, 1]}
                            scale={1.5}/>
                    </>
                    }

                    {match.is(WidthReponsive.LARGE) && <>
                        <Tivi
                            scale={6}
                            position={[0, -1.1, 1.5]}/>
                        <Ribbon
                            rotation-x={Math.PI * -0.02}
                            position={[0, -1.1, 0.3]}
                            scale={2.2}/>
                    </>
                    }
                    {match.from(WidthReponsive.VERY_LARGE) && <>
                        <Tivi
                            scale={6}
                            position={[0, -1.1, 1.5]}/>
                        <Ribbon
                            rotation-x={Math.PI * -0.02}
                            position={[0, -1.1, 0.3]}
                            scale={2.2}/>
                    </>
                    }
                </Fragment>
            }}
        </Reponsive>
    </>
};

function HtmlHeader(props: any) {
    return (
        <div className="gap-3 w-full h-fit flex justify-center items-start flex-col">
            <div className="flex flex-row gap-2 md:min-w-fit lg:gap-2 w-full h-fit justify-start items-start">
            <span
                className="xl:text-2xl col-span-1 px-4 min-w-fit text-1xl font-graduate bg-pink-700 bg-opacity-25 p-2 rounded-full text-center h-fit text-black">THE</span>
                <p
                    className="xl:text-2xl col-span-5 text-1xl font-graduate bg-black bg-opacity-25 min-w-[150px] p-2 text-center h-fit text-white">DEVLOG
                    STUDIO</p>
            </div>
            <div className="flex flex-row gap-2 xl:w-fit lg:gap-2 w-full h-fit justify-start items-start">
                <p
                    className="xl:text-2xl md:text-2xl col-span-2 min-w-fit sm:text-xl text-sm font-graduate bg-blue-400 bg-opacity-15 p-1 px-1 text-center h-fit text-black">
                    THE CREATIVE
                </p>
                <span
                    className="xl:text-2xl sm:text-xl text-sm col-span-3 min-w-fit font-graduate bg-black bg-opacity-15 p-2 px-1 h-fit text-center text-black">
                SOFTWARE DEVELOPMENT</span>
            </div>
        </div>
    )
}

