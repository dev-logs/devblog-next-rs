import * as THREE from 'three'
import {useEffect, useMemo, useRef} from 'react'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {MacOne} from '../models/macone'
import Shaders from '../glsl'
import {useFrame} from '@react-three/fiber'
import {Environment, useTexture} from '@react-three/drei'

export const Tivi = (props: any) => {
    const beerMugTexture = useTexture(`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/dale-typing-pixelated-frame.jpg`)
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
                uFrameCount: {value: 3}
            }
        })

        const bodyMaterial = new  THREE.MeshStandardMaterial({
            color: 'white',
            metalness: 0.4,
            roughness: 0.4,
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

        mesh.rotation.y += 0.005 * (yDir - mesh.rotation.y) * Math.PI
        mesh.rotation.x += 0.005 * (xDir - mesh.rotation.x) * Math.PI

        if (mesh.rotation.x > 0) {
          mesh.rotation.x = Math.min(mesh.rotation.x, 0.05 * Math.PI)
        }
        else {
          mesh.rotation.x = Math.max(mesh.rotation.x, -0.01 * Math.PI)
        }

        if (mesh.rotation.y > 0) {
          mesh.rotation.y = Math.min(mesh.rotation.y, 0.05 * Math.PI)
        }
        else {
          mesh.rotation.y = Math.max(mesh.rotation.y, -0.05 * Math.PI)
        }

        screenMaterial.uniforms.uTime.value = elapsedTime
    })

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            mouseRef.current.x = e.x
            mouseRef.current.y = e.y
        })
    }, []);

    return <>
        <Environment files={`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/warehouse.hdr`} environmentIntensity={0.7}/>
        <MacOne ref={meshRef} bodyMaterial={bodyMaterial} screenMaterial={screenMaterial} cloneScreen {...props}/>
    </>
}

useTexture.preload(`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/dale-typing-pixelated-frame.jpg`)

