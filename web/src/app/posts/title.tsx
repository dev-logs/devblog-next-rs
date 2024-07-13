import { Post } from "contentlayer/generated"
import { ThreeDCanvas } from "@/app/components/canvas"
import { useMemo } from "react"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import GLSL from "../glsl"
import { EffectComposer, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

export default function PostTitle(props: any) {
  const { post }: { post: Post } = props || {};
  return (
    <div className="relative w-screen lg:h-screen h-[50vh] overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-full z-40">
        <div className="absolute left-0 opacity-60 bottom-0 bg-gradient-to-t z-40 w-screen h-[60vh]" />
        <div className="absolute left-0 opacity-70 bg-gradient-to-r z-20 from-black h-full w-[60vw]" />
        <div className="absolute right-0 opacity-70 bg-gradient-to-l z-10 from-black h-full w-[60vw]" />
        <div className="absolute left-0 z-20 bg-gradient-to-b top-[30vh] opacity-60 w-screen h-[30vh]" />
        <div className="absolute left-0 top-0 sm:h-screen overflow-hidden h-[60vh] w-screen z-0 flex flex-col md:gap-5 gap-1 justify-between items-center">
          <img
            className="object-cover w-screen h-full opacity-30"
            src={post.publicImage}
          />
        </div>
        <div className="relative h-full overflow-hidden w-full flex flex-col items-center z-10 pt-20 xl:px-20 md:px-10 px-5 justify-end bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="flex-1 lg:mb-20 mb-10 flex flex-col items-center w-full gap-10 justify-center">
            <span className="text-sm lg:text-xl font-mono capitalize text-pink-700 underline underline-offset-1 font-bold">
              #{post.keywords}
            </span>
            <span className="xl:text-6xl md:text-4xl text-xl xl:max-w-[40vw] max-w-[70vw] text-center font-Alfa">
              {post.title}
            </span>
          </div>
          <img
            className="object-cover max-h-[60vh] h-auto w-[90vw]"
            src={post.publicImage}
          />
        </div>
      </div>
    </div>
  );
}

const HtmlDOM = (props: any) => {
  const { post } = props || {};

  return (
    <div className="w-fit h-screen flex flex-row pt-14">
      <div className="z-0 w-[70vw] h-[30vh] flex flex-col -rotate-90 gap-4 items-center">
        <span className="lg:text-7xl md:text-4xl overflow-visible text-3xl font-bold font-graduate text-gray-200">
          DEVLOGS STUDIO
        </span>
      </div>
      <div className="flex flex-col w-full h-full justify-start items-center z-10 px-3">
        <span className="lg:text-7xl md:text-4xl 2xl:max-w-[70vw] lg:px-20 px-10 text-3xl text-center font-bold font-graduate text-gray-200"></span>
      </div>
    </div>
  );
};

function Background(props: {}) {
  const perlinSampler = useTexture("/images/perlin.png");
  const [material] = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      fragmentShader: GLSL.PerlinBackgroundFragmentShader,
      vertexShader: GLSL.PerlinBackgroundVertexShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uNoiseSampler: { value: perlinSampler },
        uColor1: { value: new THREE.Color("#E1AFD1") },
        uColor2: { value: new THREE.Color("#AD88C6") },
      },
    });

    return [material];
  }, []);

  useFrame((tick) => {
    const elapsed = tick.clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;
  });

  return (
    <>
      <EffectComposer enableNormalPass={false} resolutionScale={1}>
        <Noise
          opacity={0.7}
          premultiply
          blendFunction={BlendFunction.OVERLAY}
        />
      </EffectComposer>
      <mesh material={material} scale-x={40} scale-y={10}>
        <planeGeometry args={[1, 1, 1, 1]} />
      </mesh>
    </>
  );
}
