import * as THREE from 'three'
import {useMemo} from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import Shaders from '../glsl'
import {useFrame} from "@react-three/fiber";
import {EffectComposer, Grid} from "@react-three/postprocessing";

export const PostBackground = (props: any) => {
    const [material, geometry] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: Shaders.GradientBackgroundVertexShader,
            fragmentShader: Shaders.GradientBackgroundFragmentShader,
            transparent: true,
            uniforms: {
                uTime: {value: 0},
                uColor1: {value: new THREE.Color('#030637')},
                uColor2: {value: new THREE.Color('#3C0753')},
            }
        })

       const geometry = new THREE.PlaneGeometry(20, 30, 20, 2)

       return [material, geometry]
    }, [])

    useFrame((tick) => {
        const clock = tick.clock
        material.uniforms.uTime.value = clock.getElapsedTime()
    })

    return <>
        <EffectComposer>
            <Grid scale={2} lineWidth={2}/>
        </EffectComposer>
        <mesh material={material} geometry={geometry} position-z={-1} scale={[2, 2, 2]}/>
    </>
}
