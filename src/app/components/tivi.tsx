import * as THREE from 'three'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {MacOne} from '../models/macone'
import Shaders from '../glsl'
import {useFrame} from '@react-three/fiber'
import {Environment, SpotLightShadow, Stage, useTexture} from '@react-three/drei'
import gsap from "gsap";

export const Tivi = (props: any) => {
    const beerMugTexture = useTexture('/images/dale-typing-pixelated-frame.jpg')
    beerMugTexture.flipY = false
    beerMugTexture.colorSpace = THREE.SRGBColorSpace

    const [screenMaterial, bodyMaterial]: any = useMemo(() => {
        const screenMaterial = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: Shaders.TvVertexShader,
            fragmentShader: Shaders.TvFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uPicture: {value: beerMugTexture},
                uFrameCount: {value: 4}
            }
        })

        const bodyMaterial = new  THREE.MeshStandardMaterial({
            color: '#F1EFEF',
            metalness: 0.3,
            roughness: 0.5,
        })

        return [screenMaterial, bodyMaterial]
    }, [])

    const mouseRef: any = useRef({x: 0, y: 0})
    const meshRef: any = useRef()

    useFrame((tick) => {
        const clock = tick.clock
        const elapsedTime = clock.getElapsedTime()
        if (!meshRef.current) return
        const mesh = meshRef.current

        let yDir = mouseRef.current.x / window.innerWidth - 0.5
        let xDir = mouseRef.current.y / window.innerHeight - 0.5

        mesh.rotation.y += 0.01 * (yDir - mesh.rotation.y) * Math.PI
        mesh.rotation.x += 0.01 * (xDir - mesh.rotation.x) * Math.PI

        mesh.rotation.x = Math.min(mesh.rotation.x, 0.1 * Math.PI)

        mesh.rotation.y = Math.min(mesh.rotation.y, 0.1 * Math.PI)
        mesh.rotation.y = Math.min(mesh.rotation.y, 0.1 * Math.PI)

        screenMaterial.uniforms.uTime.value = elapsedTime
    })

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            mouseRef.current.x = e.x
            mouseRef.current.y = e.y
        })
    }, []);

    return <>
        <Environment preset={"city"} environmentIntensity={1.4}/>
        <MacOne ref={meshRef} bodyMaterial={bodyMaterial} screenMaterial={screenMaterial} cloneScreen {...props}/>
    </>
}

useTexture.preload('/images/dale-typing-pixelated-frame.jpg')
