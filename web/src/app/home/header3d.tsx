import {Fragment, useMemo, useRef} from "react";
import Stats from "stats.js";
import {useFrame} from "@react-three/fiber";
import {Scroll, useScroll} from "@react-three/drei";
import {Reponsive} from "@/app/components/reponsive";
import {LowVertexModel} from "@/app/models/low-vertex";
import * as THREE from "three";
import {Tivi} from "@/app/components/tivi";
import {Ribbon} from "@/app/components/ribbon";

export default function Header3d(props: any) {
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
            airplaneRef.current.position.y = Math.cos(elapsedTime) * 4 * 0.3;
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
                                position={[2, -4, 1]}
                            />
                            <Scroll>
                                <Tivi
                                    scale={5}
                                    position={[0, -1.4, 1]}/>
                                <Ribbon
                                    position={[0, -1.25, 1]}
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
                                scale={2.4}
                                position={[2, -2, 2.3]}
                            />
                            <Scroll>
                                <Tivi
                                    scale={8}
                                    position={[0, -2, 1]}/>
                                <Ribbon
                                    rotation-x={Math.PI * -0.02}
                                    position={[0, -2.2, -0.1]}
                                    scale={3}/>
                            </Scroll>
                        </>
                        }
                    </Fragment>
                )}
            </Reponsive>
        </>
    );
};
