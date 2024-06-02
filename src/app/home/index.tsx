"use client";

import { useRef } from "react";
import * as THREE from "three";
import {
    Center,
  Html,
  Scroll,
  useScroll,
  useTexture,
} from "@react-three/drei";
import SHADERS from "../glsl";
import { useMemo } from "react";
import useGlitchFrame from "../hooks/use-glitch-frame";
import { LowVertexModel } from "../models/low-vertex";
import { ComputerWithFaceTransform } from "../models/computer";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { ThreeDCanvas } from "../components/canvas";
import { NavigationBar } from "../components/navigation-bar";
import { BlogList, BlogListBackground, BlogListTitle } from "../blogs/list";
import { Footer } from "../footer";
import { useThreeDContext } from "../contexts";
import { Geo } from "next/font/google";
import { useFrame } from "@react-three/fiber";

const TOTAL_PAGES = 3

export class HomeProps {}

export const Home = (props: HomeProps) => {
  return (
    <>
      <NavigationBar/>
      <div className="flex flex-col">
        <div className="flex w-screen h-screen z-0">
          <ThreeDCanvas
            gl={{alpha: true}}
            style={{background: 'transparent'}}
            scroll={{infinite: false, pages: TOTAL_PAGES, maxSpeed: 1.1}}>
            <CameraControls/>
            <Scroll>
              <Background/>
            </Scroll>
            <Header3d/>
            <Scroll>
              <BlogListBackground position={[2.5, -9.5, 0]}/>
            </Scroll>
            <Scroll>
              <HtmlDoms/>
            </Scroll>
          </ThreeDCanvas>
        </div>
      </div>
    </>
  );
};

const HtmlDoms = (props: any) => {
  const scrollData = useScroll();

  return <Html
    portal={{current: scrollData.fixed}}>
    <div className="absolute top-[50vh] left-[-50vw] mr-5 h-screen w-screen">
      <BlogList/>
    </div>
  </Html>
}

const Background = (props: any) => {
  const scroll = useScroll()
  const [material] = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: SHADERS.ColorBackgroundVertexShader,
      fragmentShader: SHADERS.ColorBackgroundFragmentShader,
      uniforms: {
        uTime: {value: 0},
        uProgress: {value: 0},
        uColor1: {value: new THREE.Color('#0B60B0')},
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

const CameraControls = (props: any) => {
  const data = useScroll()
  useFrame(() => {
  })

  return <></>
}

export const Ribbon = (props: any) => {
  const [textMaterial, sphereGeometry] = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 8);
    const ribbonTextMap = useTexture("/images/ribbon.png");
    ribbonTextMap.colorSpace = THREE.SRGBColorSpace;

    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: SHADERS.RibbonTextVertexShader,
      fragmentShader: SHADERS.RibbonTextFragmentShader,
      map: ribbonTextMap,
      silent: true,
      transparent: true,
      side: THREE.DoubleSide,
      color: "white",
      uniforms: {
        uTime: { value: 0.0 },
        uStrength: { value: 0.3 },
        uSpeed: { value: 0.5 },
        uTexture: { value: ribbonTextMap },
      },
    });

    return [material, geometry];
  }, []);

  const sphereRef: any = useRef(null);

  useFrame((tick: any) => {
    const clock = tick.clock;
    const elapsedTime = clock.getElapsedTime();

    textMaterial.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh
        material={textMaterial}
        position={[3, 3, -5]}
        ref={sphereRef}
        scale={1}
        geometry={sphereGeometry}
        {...props}
      ></mesh>
    </>
  );
};

export const Header3d = (props: any) => {
  const airplaneRef: any = useRef(null);
  const scrollData = useScroll();

  const scroll = useScroll()
  useFrame((tick: any) => {
    const scrollRange = scroll.range(0, 1)
    const clock = tick.clock;
    const elapsedTime = clock.getElapsedTime();
    if (airplaneRef.current) {
      airplaneRef.current.position.x = Math.sin(elapsedTime) * 3 * 0.7;
      airplaneRef.current.position.y = Math.cos(elapsedTime) * 3 * 0.4 + 0.9;
      airplaneRef.current.position.z = Math.cos(elapsedTime) * 3 * 0.4;

      airplaneRef.current.rotation.y = elapsedTime;
      airplaneRef.current.rotation.x = Math.sin(elapsedTime);
      airplaneRef.current.rotation.z =
        Math.cos(elapsedTime * 2) * 0.3 * Math.PI;

      airplaneRef.current.position.y += scrollRange * 8
    }
  });

  return (
    <>
      <LowVertexModel
        ref={airplaneRef}
        material={
          new THREE.MeshBasicMaterial({
            color: "#E5D283",
            side: THREE.DoubleSide,
          })
        }
        name="paper-airplane"
        scale={2}
        position={[2, 3, 0]}
      />
      <Scroll>
        <ComputerWithFaceTransform scales={[6, 6]} position={[0, -0.5, 0]}>
          <Html
            portal={{current: scrollData.fixed}}
            transform
            wrapperClass="htmlScreen overflow-hidden h-20 w-20"
            distanceFactor={0.15}
            occlude={"blending"}
            position={[-0.025, 0.2, 0]}>
            <div className="flex gap-3 flex-col items-center p-2">
              <div className="flex flex-row gap-1">
                <span className="text-[#0E46A3] px-3 bg-green-400 font-roboto text-6xl font-black rounded-tr-lg">
                  CREATIVE
                </span>
                <span className="font-roboto text-6xl font-black">STUDIO</span>
              </div>
              <span className="font-roboto text-6xl font-black rounded-tr-sm">
                SOFTWARE
              </span>
              <span className="font-roboto text-6xl font-black">ENGINEERING</span>
            </div>
          </Html>
        </ComputerWithFaceTransform>
        <Ribbon
          position={[0, -1.5, 0.1]}
          scale={2.5}
        />
      </Scroll>
    </>
  );
};

export const HeaderHtml = (props: any) => {
  return (
    <>
      <div className="flex flex-col h-screen w-screen justify-between">
        <NavigationBar />
        <div className="flex flex-row justify-center items-center">
          <span className="font-roboto text-[160px] font-black">DEVLOGS</span>
          <div className="bg-green-400 rounded-lg py-2 px-3 gap-0 flex flex-col justify-center items-center">
            {"s t u d i o".split(" ").map((c) => (
              <p className="font-roboto text-sm">{c}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
