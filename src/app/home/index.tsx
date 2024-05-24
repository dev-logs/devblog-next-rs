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
  OrthographicCamera,
  Outlines,
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
import { ComputerWithFaceTransform } from "../models/computer";

export class HomeProps {}

export const Home = (props: HomeProps) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="w-screen h-screen relative">
          <Canvas orthographic={true} camera={{ zoom: 20 }} color={"#0E46A3"}>
            <LowVertexModelProvider>
              <Header />
            </LowVertexModelProvider>
          </Canvas>
        </div>
        <div className="absolute top-0 left-0">
          <HeaderHtml />
        </div>
      </div>
    </>
  );
};

export const NavigationBar = (props: any) => {
  return <>
    <div className="bg-gray-50 bg-opacity-15 flex flex-row w-screen py-5 justify-center items-center gap-5">
      <span className="font-roboto">HOME</span>
      <span className="font-roboto">BLOGS</span>
      <span className="font-roboto">WORKS</span>
    </div>
  </>
}

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
  )
}

export const Header3d = (props: any) => {
  const context = useThreeDContext();

  return (
    <>
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[context.width * 10, context.height * 10]}/>
        <meshBasicMaterial color={"#0E46A3"}/>
      </mesh>
      <ComputerWithFaceTransform/>
      <Bounds fit clip margin={1.0}></Bounds>
    </>
  );
};

export const HeaderHtml = (props: any) => {
  return (
    <>
      <div className="flex flex-col gap-5 h-screen w-screen justify-between">
        <NavigationBar/>
        <div className="flex gap-3 flex-col items-center">
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
        <div className="flex flex-row justify-center items-center">
          <span className="font-roboto text-[160px] font-black">DEVLOGS</span>
          <div className="bg-green-400 rounded-lg py-2 px-3 gap-0 flex flex-col justify-center items-center">
            {"s t u d i o".split(" ").map((c) => <p className="font-roboto text-sm">{c}</p>)}
          </div>
        </div>
      </div>
    </>
  );
};
