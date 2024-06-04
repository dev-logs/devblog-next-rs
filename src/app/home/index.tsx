"use client";

import { useCallback, useEffect, useRef } from "react";
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
import { ComputerWithFace, ComputerWithFaceTransform } from "../models/computer";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { ThreeDCanvas } from "../components/canvas";
import { NavigationBar } from "../components/navigation-bar";
import { BlogList, BlogListBackground, BlogListTitle } from "../blogs/list";
import { useFrame } from "@react-three/fiber";
import { MacOne } from "../models/macone";
import { Tivi } from "../components/tivi";

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
            <Background/>
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

  return <Html portal={{current: scrollData.fixed}}>
  <div className="absolute top-[-75vh] left-[-50vw] flex flex-col gap-10 items-center p-2 w-screen h-screen justify-center">
    <span className="text-9xl font-graduate text-black">DEVLOGS STUDIO</span>
    <span className="text-8xl font-graduate text-black">CREATIVE STUDIO</span>
  </div>
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
        uColor1: {value: new THREE.Color('#191919')},
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
        scale={2}
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
          new THREE.MeshStandardMaterial({
            color: "#C5FF95",
            emissive: '#C5FF95',
            side: THREE.DoubleSide
          })
        }
        name="paper-airplane"
        scale={2}
        position={[2, 3, 0]}
      />
      <Scroll>
        <Tivi scale={9} position={[0, -2.5, 0]}/>
      <Ribbon
        position={[0, -1.8, 0.1]}
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
