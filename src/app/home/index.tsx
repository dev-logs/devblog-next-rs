"use client";

import React, { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Canvas,
  useThree,
  extend as threeFiberExtend,
  useFrame,
} from "@react-three/fiber";
import {
  BBAnchor,
  Bounds,
  Box,
  Center,
  Environment,
  Float,
  Html,
  Mask,
  OrbitControls,
  OrthographicCamera,
  Outlines,
  PresentationControls,
  Resize,
  ScreenSizer,
  Stage,
  Text3D,
  useBounds,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import noop from "lodash/noop";
import SHADERS from "../glsl";
import {
  Vignette,
  EffectComposer,
  Bloom,
  Noise,
} from "@react-three/postprocessing";
import gsap from "gsap";
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import useGlitchFrame from "../hooks/use-glitch-frame";
import useGlitch from "../hooks/use-glitch";
import { LowVertex } from "../models";
import { LowVertexModel, LowVertexModelProvider } from "../models/low-vertex";
import { ThreeD, ThreeDContext, useThreeDContext } from "../contexts";
import {
  ComputerWithFace,
  ComputerWithFaceTransform,
} from "../models/computer";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { Group } from "three/examples/jsm/libs/tween.module.js";

export class HomeProps {}

export const Home = (props: HomeProps) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col w-screen h-screen absolute top-0 left-0 z-0">
          <Canvas>
            <LowVertexModelProvider>
              <Header />
            </LowVertexModelProvider>
          </Canvas>
        </div>
        <div className="absolute top-0 left-0 z-10">
          <Header3dText />
        </div>
      </div>
    </>
  );
};

export const NavigationBar = (props: any) => {
  return (
    <>
      <div className="bg-gray-50 bg-opacity-15 flex flex-row w-screen py-5 justify-center items-center gap-5">
        <span className="font-roboto">HOME</span>
        <span className="font-roboto">BLOGS</span>
        <span className="font-roboto">WORKS</span>
      </div>
    </>
  );
};

export const Header = (props: any) => {
  const { viewport } = useThree();
  const context = useMemo(
    () =>
      new ThreeD({
        scale: 20,
        viewport,
      }),
    [],
  );

  return (
    <>
      <ThreeDContext.Provider value={context}>
        <Header3d />
      </ThreeDContext.Provider>
    </>
  );
};

export const Header3dText = (props: any) => {
  const Implementation = () => {
    const textMaterial = useMemo(
      () => {
        const ribbonTextMap = useTexture('/images/ribbon2.png')
        ribbonTextMap.colorSpace = THREE.SRGBColorSpace

        return new CustomShaderMaterial({
          baseMaterial: THREE.MeshBasicMaterial,
          vertexShader: SHADERS.RibbonTextVertexShader,
          fragmentShader: SHADERS.RibbonTextFragmentShader,
          map: ribbonTextMap,
          silent: true,
          transparent: true,
          side: THREE.DoubleSide,
          color: 'white',
          uniforms: {
            uTime: { value: 0.0 },
            uStrength: { value: 0.15 },
            uSpeed: { value: 0.5 },
            uMap: {value: ribbonTextMap}
          },
        })
      },
      [],
    );

    const backgroundMaterial = useMemo(
      () =>
        new CustomShaderMaterial({
          baseMaterial: THREE.MeshBasicMaterial,
          vertexShader: SHADERS.RibbonBackgroundVertexShader,
          fragmentShader: SHADERS.RibbonBackgroundFragmentShader,
          silent: true,
          uniforms: {
            uSpeed: { value: 0.5 },
            uTime: { value: 0 },
            uColor1: {value: new THREE.Color('#FFC100')},
            uColor2: {value: new THREE.Color('#1F1717')},
          },
        }),
      [],
    );

    const sphereRef: any = useRef(null)

    useGlitchFrame(0.0, (tick: any) => {
      const clock = tick.clock;
      const elapsedTime = clock.getElapsedTime();

      textMaterial.uniforms.uTime.value = elapsedTime;
      backgroundMaterial.uniforms.uTime.value = elapsedTime;
      if (sphereRef.current) {
        sphereRef.current.rotation.y = elapsedTime * 0.5
        sphereRef.current.rotation.x = 0.5
      }
    });

    const context = useThree().viewport;

    return (
      <>
        <OrbitControls/>
        <Environment preset="city" environmentIntensity={1}/>
        <color args={["#0E46A3"]} attach={"background"} />
        {/* <mesh material={backgroundMaterial}>
          <planeGeometry args={[context.width, 7]} />
        </mesh> */}
        <Center disableY>
          <mesh material={textMaterial} position={[3, 3, -5]} ref={sphereRef}>
            <icosahedronGeometry args={[1, 10]}/>
          </mesh>
        </Center>
      </>
    );
  };

  return (
    <div className="w-screen h-screen">
      <Canvas>
        <Implementation/>
      </Canvas>
    </div>
  );
};

export const Header3d = (props: any) => {
  const context = useThreeDContext();
  const airplaneRef: any = useRef(null);

  useFrame((tick) => {
    const clock = tick.clock;
    const elapsedTime = clock.getElapsedTime();
    if (airplaneRef.current) {
      airplaneRef.current.position.x = Math.sin(elapsedTime) * 3;
      airplaneRef.current.position.y = Math.cos(elapsedTime) * 3 * 0.5;
      airplaneRef.current.position.z = Math.cos(elapsedTime) * 3 * 0.5;

      airplaneRef.current.rotation.y = elapsedTime;
      airplaneRef.current.rotation.x = Math.sin(elapsedTime);
      airplaneRef.current.rotation.z =
        Math.cos(elapsedTime * 2) * 0.3 * Math.PI;
    }
  });

  return (
    <>
      <LowVertexModel
        ref={airplaneRef}
        material={
          new THREE.MeshBasicMaterial({
            color: "white",
            side: THREE.DoubleSide,
          })
        }
        name="paper-airplane"
        scale={2}
        position={[2, 3, 0]}
      />
      <color args={["#0E46A3"]} attach={"background"} />
      <ComputerWithFaceTransform scales={[6, 6]} position={[0, 0, 0]}>
        <Html
          transform={true}
          wrapperClass="htmlScreen"
          distanceFactor={0.15}
          occlude={"blending"}
          position={[-0.025, 0.2, 0]}
        >
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
