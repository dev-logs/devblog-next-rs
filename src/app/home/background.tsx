import {useScroll} from "@react-three/drei"
import {useMemo} from "react"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import * as THREE from 'three'
import SHADERS from '../glsl'
import {useFrame} from "@react-three/fiber"
import {TOTAL_PAGES} from "."

export const HomeBackground = (props: any = {}) => {
    const scroll = props.scrollData || useScroll()
    if (!scroll) return

    const [material] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: SHADERS.ColorBackgroundVertexShader,
            fragmentShader: SHADERS.ColorBackgroundFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uProgress: {value: 0},
                uColor1: {value: new THREE.Color('#F1EFEF')},
                uColor2: {value: new THREE.Color('#191919')}
            }
        })

        return [material]
    }, [])

    useFrame((tick) => {
        const clock = tick.clock
        const elapsedTime = clock.getElapsedTime()
        const scrollRange = scroll.range(0, 1 / TOTAL_PAGES)

        material.uniforms.uTime.value = elapsedTime
        material.uniforms.uProgress.value = scrollRange
    })

    return <>
        <mesh position={[0, 0, -5]} material={material}>
            <planeGeometry args={[100, 100]}/>
        </mesh>
    </>
}
