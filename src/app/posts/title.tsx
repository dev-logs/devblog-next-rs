import {Post} from "contentlayer/generated"
import {ThreeDCanvas} from "@/app/components/canvas";
import {useEffect, useMemo, useRef} from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import * as THREE from 'three'
import {Bounds, Stage, useTexture, Text, Html, Center, OrbitControls, Environment} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import { EffectComposer, Grid, Vignette } from "@react-three/postprocessing";

export default function PostTitle(props: any) {
    const {post}: { post: Post } = props || {}
    return <div className="relative w-screen h-screen">
        <div className="absolute top-0 left-0 w-screen h-screen z-40">
          <div className={`absolute left-0 z-20 bg-gradient-to-b opacity-20 top-0 w-screen h-[30vh]`} style={{
             '--tw-gradient-from': `${'#000000'} var(--tw-gradient-from-position)`,
             '--tw-gradient-to': 'rgb(0 0 0 / 0) var(--tw-gradient-to-position)',
             '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
          }}/>
          <div className="absolute left-0 opacity-60 bottom-0 bg-gradient-to-t z-40 w-screen h-[60vh]" style={{
              '--tw-gradient-from': `${'#000000'} var(--tw-gradient-from-position)`,
              '--tw-gradient-to': 'rgb(0 0 0 / 0) var(--tw-gradient-to-position)',
              '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
          }}/>
          <div className="absolute left-0 opacity-40 bg-gradient-to-r z-20 from-black h-screen w-[60vh]" style={{
              '--tw-gradient-from': `${'#000000'} var(--tw-gradient-from-position)`,
              '--tw-gradient-to': 'rgb(0 0 0 / 0) var(--tw-gradient-to-position)',
              '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
          }}/>
          <div className="absolute right-0 opacity-40 bg-gradient-to-l z-10 from-black h-screen w-[60vh]" style={{
              '--tw-gradient-from': `${'#000000'} var(--tw-gradient-from-position)`,
              '--tw-gradient-to': 'rgb(0 0 0 / 0) var(--tw-gradient-to-position)',
              '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
          }}/>
          <div className="absolute opacity-10 bottom-0 left-0 h-screen w-screen">
              <img src={post.publicImage} className="w-full h-full object-cover"/>
          </div>
          <div className="absolute pt-28 left-0 top-0 h-screen w-screen z-20 flex flex-col px-20 gap-5 justify-between items-center">
            <span className="text-xl font-graduate text-blue-400 font-bold">technical blog</span>
            <span className="text-5xl max-w-[50vw] text-center font-Alfa">{post.title}</span>
             <ThreeDCanvas>
                <Background post={post}/>
             </ThreeDCanvas>
          </div>
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
         {/*<img src={post.publicImage} className="w-full h-[120px] object-cover"/>*/}
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
              uniform sampler2D uTexture;
              uniform vec2 uMousePosition;
              uniform float uTime;
              
              void main() {
                vUv = uv;
                vec4 delta = texture2D(uTexture, vUv);

                csm_Position.z += smoothstep(0.5, 1.2, length(delta)) * 1.0;
                csm_Position.z += smoothstep(0.5, 1.2, 1.0 - length(delta)) * 2.0;
                float noise = sin((uMousePosition.x - vUv.x) * uTime * 10.0) * 0.2;
                noise *= cos((uMousePosition.y - vUv.y) * uTime * 10.0) * 0.2;
                csm_Position.z += noise;
              }
            `,
            fragmentShader: `
              uniform sampler2D uTexture;
              uniform vec2 uMousePosition;
              varying vec2 vUv;

              void main() {
                vec4 color = texture2D(uTexture, vUv);
                csm_FragColor = color;
                csm_FragColor *= length(color);
                csm_FragColor.a = step(abs(uMousePosition.x) * 0.3, color.g);
              }
            `,
            uniforms: {
                uTime: {value: 0},
                uMousePosition: {value: new THREE.Vector2()},
                uTexture: {value: texture}
            }
        })

        const geometry = new THREE.PlaneGeometry(2, 1, 8, 8)

        return [material, geometry]
    }, [])

    const mouseRef = useRef({x: 0, y: 0})
    const imageRef: any = useRef()

    useEffect(() => {
       addEventListener('mousemove', (e: MouseEvent) => {
           const x = e.x / window.innerWidth - 0.5
           const y = e.y / window.innerHeight - 0.5

           mouseRef.current.x = x
           mouseRef.current.y = y
       })
    }, [material])

    useFrame((tick) => {
        const mousePos = mouseRef.current
        const clock = tick.clock
        const elapsed = clock.getElapsedTime()
        material.uniforms.uTime.value = elapsed
        material.uniforms.uMousePosition.value = new THREE.Vector2(mousePos.x, mousePos.y)

        if (imageRef.current) {
            const mesh = imageRef.current
            mesh.rotation.x = (mousePos.y - mesh.rotation.y) * 0.002 * elapsed
            mesh.rotation.y = (mousePos.x - mesh.rotation.x) * 0.002 * elapsed
        }
    })

    return <>
      <EffectComposer enableNormalPass={false}>
         <Grid scale={4.75} lineWidth={0.75}/>
      </EffectComposer>
      <mesh material={material} position-z={-1} ref={imageRef}>
        <planeGeometry args={[20, 10, 28, 28]}/>
      </mesh>
    </>
}
