import {Post} from "contentlayer/generated"
import Image from "next/image"
import {ThreeDCanvas} from "@/app/components/canvas";
import {useMemo} from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import * as THREE from 'three'
import Shaders from "@/app/glsl";
import {Bounds, Stage, useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {PostBackground} from "@/app/posts/background";

export const PostTitle = (props: any) => {
    const {post}: { post: Post } = props || {}
    return <>
        <div className="relative w-full 2xl:h-[100vh] xl:h-[70vh] h-[50vh] bg-black bg-opacity-15 backdrop-blur-3xl">
            <div className="absolution top-0 left-0 z-0 w-full h-full">
                <ThreeDCanvas>
                     <Bounds fit clip observe margin={0.8} maxDuration={1}>
                       <Background {...props}/>
                    </Bounds>
                </ThreeDCanvas>
            </div>
            <div className="absolute top-0 left-0 flex flex-col w-full h-full justify-center items-center z-10 px-3">
                <span
                    className="lg:text-7xl md:text-4xl 2xl:max-w-[70vw] lg:px-20 px-10 text-3xl text-center font-bold font-graduate text-gray-200">{post.title}</span>
            </div>
        </div>
    </>
}

const Background = (props: any) => {
    const post: Post = props.post
    const texture = useTexture(post.publicImage)
    texture.colorSpace = THREE.SRGBColorSpace

    const [material, geometry] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: Shaders.WingingVertexFragmentShader,
            fragmentShader: Shaders.WingingBackgroundFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uTexture: {value: texture}
            }
        })

        const geometry = new THREE.PlaneGeometry(2, 1, 8, 8)

        return [material, geometry]
    }, [])

    useFrame((tick) => {
        const clock = tick.clock
        material.uniforms.uTime.value = clock.getElapsedTime()
    })

    return <>
        <mesh material={material} geometry={geometry}/>
    </>
}
