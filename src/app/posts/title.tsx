import {Post} from "contentlayer/generated"
import Image from "next/image"
import {ThreeDCanvas} from "@/app/components/canvas";
import {useMemo} from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import * as THREE from 'three'
import Shaders from "@/app/glsl";
import {Bounds, Stage, useTexture, Text, Html, Center} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import { EffectComposer, Grid, Vignette } from "@react-three/postprocessing";
import { Tivi } from "../components/tivi";
import Keyboard from "../models/keyboard";

export default function PostTitle(props: any) {
    const {post}: { post: Post } = props || {}
    return <div className="relative w-screen h-screen">
        <div className="absolute top-0 left-0 w-screen h-screen z-40">
          <div className="absolute left-0 top-0 bg-gradient-to-b z-10 opacity-10 from-gray-600 w-screen h-[30vh]"/>
          <div className="absolute left-0 bottom-0 bg-gradient-to-t z-10 from-black w-screen h-[60vh]"/>
          <div className="absolute left-0 bg-gradient-to-r z-10 from-black h-screen w-[60vh]"/>
          <div className="absolute right-0 bg-gradient-to-l z-10 from-black h-screen w-[60vh]"/>
          <div className="absolute opacity-20 z-10 bottom-0 left-0 h-screen w-screen px-20">
            <img src={post.publicImage} className="h-screen w-screen object-cover"/>
          </div>
          <div className="absolute left-0 top-0 pt-20 h-screen w-screen z-20 flex flex-col px-20 gap-5 justify-between items-center">
            <span className="text-xl font-graduate text-blue-400 font-bold">technical blog</span>
            <span className="text-5xl max-w-[50vw] text-center font-Alfa">{post.title}</span>
            <img src={post.publicImage} className="h-[60vh] w-full object-cover"/>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-screen h-screen z-30 flex flex-col">
          {/* <ThreeDCanvas>
            <Background post={post}/>
          </ThreeDCanvas> */}
        </div>
    </div>
}

const HtmlDOM = (props: any) => {
  const {post} = props || {}

  return <div className="w-fit h-screen flex flex-row pt-14">
       <div className="z-0 w-[70vw] h-[30vh] flex flex-col -rotate-90 gap-4 items-center">
         <span
           className="lg:text-7xl md:text-4xl overflow-visible text-3xl font-bold font-graduate text-gray-200">
           DEVLOGS STUDIO
         </span>
         <img src={post.publicImage} className="w-full h-[120px] object-cover"/>
       </div>
       <div className="flex flex-col w-full h-full justify-start items-center z-10 px-3">
           <span
               className="lg:text-7xl md:text-4xl 2xl:max-w-[70vw] lg:px-20 px-10 text-3xl text-center font-bold font-graduate text-gray-200">
           </span>
       </div>
   </div>
}

const Background = (props: any) => {
    const post: Post = props.post
    const texture = useTexture(post.publicImage)
    texture.colorSpace = THREE.SRGBColorSpace

    const [material, geometry] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
              }
            `,
            fragmentShader: `
              uniform sampler2D uTexture;
              varying vec2 vUv;

              void main() {
                vec4 color = texture2D(uTexture, vUv);
                csm_FragColor = color;
                csm_FragColor *= distance(vUv * 0.3, vec2(0.5)) * 0.5;
              }
            `,
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
      <Center>
        <Html
          center
          position={[-1, -2, 0]}>
          {/* <HtmlDOM post={post}/> */}
        </Html>
      </Center>
      <EffectComposer enableNormalPass={false}>
        {/* <Grid scale={1.75} lineWidth={0.25}/> */}
      </EffectComposer>
      <mesh material={material} position-z={-1}>
        <planeGeometry args={[30, 10]}/>
      </mesh>
      <Text maxWidth={5} textAlign="center" font="/fonts/damn.ttf" fontSize={0.5} position={[0, 2, 1]}>{post.title}</Text>
      <Keyboard scale={8} rotation-x={Math.PI * 0.2} rotation-z={Math.PI * 0.1} rotation-y={Math.PI * 0.2}/>
      {/* <Tivi scale={10} position={[0, -2, 0]}/> */}
    </>
}
