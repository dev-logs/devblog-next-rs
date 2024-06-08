"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
    Center,
    Html,
    Scroll,
    useScroll
} from "@react-three/drei";
import { LowVertexModel } from "../models/low-vertex";
import { ThreeDCanvas } from "../components/canvas";
import { NavigationBar } from "../components/navigation-bar";
import { BlogList, BlogListBackground } from "../blogs/list";
import { useFrame, useThree } from "@react-three/fiber";
import { Tivi } from "../components/tivi";
import { BasicInteraction } from "../components/basic-interaction";
import { RunningText } from "../components/running-text";
import { Ribbon } from "../components/ribbon";
import { HomeBackground } from "./background";
import { Footer3d, FooterHtml } from "../components/footer";
import { debounce } from "lodash";

export const TOTAL_PAGES = 5

export class HomeProps {}

export const Home = (props: HomeProps) => {
  const footer3dRef = useRef(null)
  return (
    <>
      <NavigationBar/>
      <div className="flex flex-col">
        <div className="flex w-screen h-screen z-0">
          <ThreeDCanvas
            gl={{alpha: true}}
            style={{background: 'transparent'}}
            scroll={{infinite: false, pages: TOTAL_PAGES, maxSpeed: 1.1}}>
            <HomeBackground/>
            <Header3d/>
            <Scroll>
              <BlogListBackground position={[2.5, -9.5, 0]}/>
            </Scroll>
            <Scroll>
              <HtmlDoms footer3dRef={footer3dRef}/>
            </Scroll>
          </ThreeDCanvas>
        </div>
      </div>
    </>
  );
};

const HtmlDoms = (props: any) => {
  const scrollData = useScroll()
  return <Html portal={{current: scrollData.fixed}}>
  <div className="absolute top-[-75vh] left-[-50vw] flex flex-col gap-10 items-center p-2 w-screen h-screen justify-center">
    <span className="md:text-8xl text-4xl font-graduate text-center text-black">DEVLOGS STUDIO, CREATIVE SOFTWARE DESIGN</span>
  </div>
  <div className="absolute top-[50vh] left-[-50vw] mr-5 w-screen flex flex-col gap-14">
    <BlogList/>
    <RunningText/>
    <div className="mx-10">
      <BasicInteraction/>
    </div>
    <div>
      <FooterHtml scrollData={scrollData} footer3dRef={props.footer3dRef}/>
    </div>
    <div className="h-96"></div>
  </div>
  </Html>
}

export const Header3d = (props: any) => {
  const airplaneRef: any = useRef(null);
  const scrollData = useScroll();

  const scroll = useScroll()
  useFrame((tick: any) => {
    const scrollRange = scroll.range(0, 1)
    const clock = tick.clock;
    const elapsedTime = clock.getElapsedTime();
    if (airplaneRef.current) {
      airplaneRef.current.position.x = Math.sin(elapsedTime) * 4 * 0.7;
      airplaneRef.current.position.y = Math.cos(elapsedTime) * 4 * 0.2;
      airplaneRef.current.position.z = Math.cos(elapsedTime) * 4 * 0.4;

      airplaneRef.current.rotation.y = elapsedTime;
      airplaneRef.current.rotation.x = Math.sin(elapsedTime * 2) * 0.8;
      airplaneRef.current.rotation.z = Math.cos(elapsedTime * 2) * 0.1;

      airplaneRef.current.position.y += scrollRange * 30
    }
  });

  return (
    <>
      <LowVertexModel
        ref={airplaneRef}
        material={
          new THREE.MeshBasicMaterial({
            color: "#F05454",
            side: THREE.DoubleSide
          })
        }
        name="paper-airplane"
        scale={3}
        position={[2, -3, 0]}
      />
      <Scroll>
        <Tivi
          scale={9}
          position={[0, -2.5, 0]}/>
        <Ribbon
          position={[0, -1.8, 0.1]}
          scale={2.5}/>
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
