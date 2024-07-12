import {useMemo} from "react"
import {ThreeDCanvas} from "./canvas"
import * as THREE from "three"
import {NewSletterSubscription} from "./new-sletter-subscription"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import SHADERS from "../glsl"
import {useFrame} from "@react-three/fiber"
import {useTexture} from "@react-three/drei"
import { VoteForNextTopic } from "./vote-next-topic/card-layout"

export const BasicInteraction = (props: any) => {
    return (
        <div className="md:h-[120vh] h-[800px] md:min-h-[1400px] max-h-[1900px] bg-opacity-0 flex flex-col">
            <div className="h-full w-full relative">
              <div className="z-0 absolute top-0 left-0 h-full w-full">
                  <ThreeDCanvas performance={{min: 1, max: 1}}>
                    <Background/>
                  </ThreeDCanvas>
              </div>
              <div
                  className="z-10 absolute left-0 top-0 rounded-2xl justify-center w-full py-14 px-10 flex flex-col xl:h-[50vh] h-[40vh] items-center">
                  <div className="w-[70vw] min-w-[250px] max-w-[500px]">
                      <NewSletterSubscription/>
                  </div>
              </div>
            </div>
            <div className="w-full h-full">
              <VoteForNextTopic/>
            </div>
        </div>
    );
};

const Background = (props: any) => {
    const image = useTexture("/images/timeframe1.jpg");
    image.colorSpace = THREE.SRGBColorSpace;

    const [material, geometry] = useMemo(() => {
        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            silent: true,
            color: "white",
            transparent: true,
            vertexShader: SHADERS.BackgroundFrameVertexShader,
            fragmentShader: SHADERS.BackgroundFrameFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uImage: {value: image}
            },
        })

        const geometry = new THREE.PlaneGeometry(100, 10, 42)
        return [material, geometry]
    }, [])

    useFrame((tick) => {
        const clock = tick.clock
        const elapsedTime = clock.getElapsedTime()

        material.uniforms.uTime.value = elapsedTime
    })

    return (
        <>
            <mesh material={material} geometry={geometry}/>
        </>
    );
};
