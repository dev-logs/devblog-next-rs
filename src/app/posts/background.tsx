import {ThreeDCanvas} from "@/app/components/canvas";
import * as THREE from 'three'
import {useMemo} from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import Shaders from '../glsl'
import {useFrame} from "@react-three/fiber";

export const PostBackground = (props: any) => {
    const [material, geometry] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            color: 'black',
            vertexShader: Shaders.GradientBackgroundVertexShader,
            fragmentShader: Shaders.GradientBackgroundFragmentShader,
            transparent: true,
            uniforms: {
                uTime: {value: 0},
                uColor1: {value: new THREE.Color('#FF6701')},
                uColor2: {value: new THREE.Color('#30475E')},
            }
        })

       const geometry = new THREE.PlaneGeometry(20, 30, 20, 20)

       return [material, geometry]
    }, [])

    useFrame((tick) => {
        const clock = tick.clock
        const elapsedTime = clock.getElapsedTime()
        material.uniforms.uTime.value = elapsedTime
    })

    return <>
      <mesh material={material} geometry={geometry} position-z={-1}/>
    </>
}
