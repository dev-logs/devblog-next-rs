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
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
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
import { LowVertexModel } from "../models/low-vertex";
import { ThreeD, ThreeDContext, useThreeDContext } from "../contexts";

threeFiberExtend(CustomShaderMaterial);

export class BlogListProps {}

export const BlogList = (props: BlogListProps) => {
  return (
    <div className="relative flex flex-row h-full w-full">
      <div className="w-full h-full">
        <Canvas orthographic={true}>
          {/* <OrthographicCamera/> */}
          <FirstScene/>
        </Canvas>
      </div>
      <div
        className="absolute top-0 left-0
          w-full h-full bg-transparent flex flex-row justify-start items-start p-20">
        <div className="flex flex-col w-[20vw] h-full rounded-lg">
          <div className="bg-gray-950 bg-opacity-50 pl-10 pt-10 rounded-tl-lg">
            <p className="text-3xl font-bold">Devlog</p>
            <p className="text-sm">studio</p>
            <p className="text-5xl font-bold mt-20">BLogs</p>
            <div className="flex flex-row gap-5 mt-28">
              <p>Engineer</p>
              <p>Life</p>
            </div>
          </div>
          <div className="w-full h-full border-[30px] rounded-b-lg border-opacity-50 border-gray-950"></div>
        </div>
        <div className="w-full h-full bg-gray-950 bg-opacity-50 p-10 rounded-tr-lg rounded br-lg"></div>
      </div>
    </div>
  );
};

export const FirstScene = () => {
  const {viewport} = useThree()
  const context = useMemo(() => new ThreeD({
    scale: 10,
    viewport
  }), [])

  return <>
    <ThreeDContext.Provider value={context}>
      <Foreground />
    </ThreeDContext.Provider>
  </>
}

export class TransformGeometryProps {
  geometries: Array<THREE.BufferGeometry> = [];
  selectedIndex: number = 0;
  delay: number = 0;
  duration: number = 0;
  scales: Array<number> = [];
  onComplete: Function = noop;
}

export const TransformGeometry = (props: TransformGeometryProps) => {
  let { geometries, selectedIndex, delay, duration, scales, onComplete } =
    props;

  const map = useTexture("/3d-models/the-scene-1/environment-tokio.jpg");
  map.colorSpace = THREE.SRGBColorSpace;

  const { mesh, material, updateAttributes, saveAnimation } = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: SHADERS.PointerVertexShader,
      fragmentShader: SHADERS.PointerFragmentShader,
      metalness: 0.0,
      roughness: 0.0,
      color: "#BED754",
      wireframe: false,
      silent: true,
      vertexColors: true,
      map,
      uniforms: {
        uTime: { value: 0.0 },
      },
    });

    const nonIndexedGeometries = geometries.map((geo) => {
      const geometry = geo.toNonIndexed();
      return geometry;
    });

    const maxVertexCount = Math.max(
      ...nonIndexedGeometries.map((geo) => geo.attributes.position.count),
    );

    const vertexArrays = nonIndexedGeometries.map((geo) => {
      const vertices = geo.attributes.position.array;
      const normals = geo.attributes.normal.array;
      const uvs = geo.attributes.uv
        ? geo.attributes.uv.array
        : new Float32Array((vertices.length / 3) * 2);

      if (geo.attributes.position.count < maxVertexCount) {
        const extendedVertices = new Float32Array(maxVertexCount * 3);
        const extendedNormals = new Float32Array(maxVertexCount * 3);
        const extendedUvs = new Float32Array(maxVertexCount * 2);
        extendedVertices.set(vertices);
        extendedNormals.set(normals);
        extendedUvs.set(uvs);
        return {
          vertices: extendedVertices,
          normals: extendedNormals,
          uvs: extendedUvs,
        };
      }
      return { vertices, normals, uvs };
    });

    const baseGeometry = new THREE.BufferGeometry();
    const basePosition = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );
    basePosition.array.set(vertexArrays[0].vertices);
    const baseNormal = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );
    baseNormal.array.set(vertexArrays[0].normals);
    const baseUv = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      2,
    );
    baseUv.array.set(vertexArrays[0].uvs);

    baseGeometry.setAttribute("position", basePosition);
    baseGeometry.setAttribute("normal", baseNormal);
    baseGeometry.setAttribute("uv", baseUv);

    const aPosition2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );

    const aNormal2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );

    const aUv2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 2),
      2,
    );

    baseGeometry.setAttribute("aPosition2", aPosition2);
    baseGeometry.setAttribute("aNormal2", aNormal2);
    baseGeometry.setAttribute("aUv2", aUv2);

    const updateAttributes = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return;
      }

      const targetVertices = vertexArrays[index].vertices;
      const targetNormals = vertexArrays[index].normals;
      const targetUvs = vertexArrays[index].uvs;

      aPosition2.array.set(targetVertices);
      aNormal2.array.set(targetNormals);
      aUv2.array.set(targetUvs);
      aPosition2.needsUpdate = true;
      aNormal2.needsUpdate = true;
      aUv2.needsUpdate = true;
    };

    const saveAnimation = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return;
      }

      const targetVertices = vertexArrays[index].vertices;
      const targetNormals = vertexArrays[index].normals;
      const targetUvs = vertexArrays[index].uvs;

      basePosition.array.set(targetVertices);
      baseNormal.array.set(targetNormals);
      baseUv.array.set(targetUvs);
      basePosition.needsUpdate = true;
      baseNormal.needsUpdate = true;
      baseUv.needsUpdate = true;
      material.uniforms.uTime.value = 0;
    };

    return {
      mesh: new THREE.Mesh(baseGeometry, material),
      material,
      geometry: baseGeometry,
      updateAttributes,
      saveAnimation,
    };
  }, []);

  const glitch = useGlitch(
    0.3,
    (value) => {
      material.uniforms.uTime.value = value;
    },
    [selectedIndex, updateAttributes, material],
  );

  useEffect(() => {
    const gsapGlitch = { value: 0 };
    updateAttributes(selectedIndex);
    gsap.fromTo(
      gsapGlitch,
      { value: 0 },
      {
        value: 1,
        duration,
        delay,
        ease: "power2.in",
        onUpdate: () => {
          glitch(gsapGlitch.value);
        },
        onComplete: () => {
          saveAnimation(selectedIndex);
          onComplete();
        },
      },
    );
  }, [selectedIndex, material, updateAttributes]);

  return (
    <>
      <primitive
        object={mesh}
        position-z={0}
        scale={scales[selectedIndex] || 1}
      />
    </>
  );
};

export const NoiseTextBackground = (props: any) => {
  const {
    count = 0,
    text = 'Devlogs Studio',
    cap = false
  } = props || {}

  const material: any = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      silent: true,
      side: THREE.DoubleSide,
      color: '#31363F',
      opacity: 0.4,
      transparent: true,
      fragmentShader: SHADERS.SimpleWobbleFragmentShader,
      vertexShader: SHADERS.SimpleWobbleVertexShader,
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.015 },
        uColor: { value: new THREE.Color("#31363F") },
      },
    })
  }, [])

  const threeDContext = useThreeDContext()!

  const distributedTexts = useMemo(() => {
    const result = []
    console.log(threeDContext.height)
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * (text.length - 1))
      // -1 .. 1
      let x = (Math.random() - 0.5) * threeDContext.width * 2
      let y = (Math.random() - 0.5) * threeDContext.height * 2
      // x += (Math.abs(x)/x) * 1
      const z = -10

      result.push({
        text: text[index],
        position: [x, y, z]
      })
    }

    return result
  }, [text, cap, threeDContext, threeDContext.width, threeDContext.height])

  useGlitchFrame(0.3, (tick) => {
    material.uniforms.uTime.value = tick.clock.getElapsedTime()
  })

  return <>
    {distributedTexts.map((info: any) => <>
      <Text3D
        material={material}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1 * Math.random()}
        height={0.6}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={info.position}>
        {info.text}
      </Text3D>
    </>)}
  </>
}

export const Background = () => {
  const milkRef = useRef<any>(null)
  const context = useThreeDContext();

  const materialProvider = useCallback((node: any) => {
    return new CustomShaderMaterial({
      baseMaterial: new THREE.MeshBasicMaterial({map: node.material.map}),
      silent: true,
      side: THREE.DoubleSide,
      fragmentShader: SHADERS.SimpleWobbleFragmentShader,
      vertexShader: SHADERS.SimpleWobbleVertexShader,
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.015 },
        uColor: { value: new THREE.Color("#F7F7F7") },
      },
    });
  }, []);

  useGlitchFrame(0.5, (tick) => {
    if (milkRef.current) {
      milkRef.current.material.uniforms.uTime.value =
        tick.clock.getElapsedTime()
    }
  })

  return (
    <>
      {/* <LowVertex.LowVertexModelProvider>
        <LowVertexModel
          name="paper-milk-pack"
          materialProvider={materialProvider}
          position={[context.width / 2 - 1.2, 0, 1]}
          scale={4}
          ref={milkRef}
        />
      </LowVertex.LowVertexModelProvider> */}
    </>
  );
};

export const ViewportComponent = (props: any) => {
  const {
    margin = 0
  } = props || {}

  const _ViewPortHook = () => {
    const context = useThreeDContext()
    const bounds = useBounds()

    useEffect(() => {
      bounds.refresh().fit().clip()
    }, [context.width, context.height])

    return <>
      <mesh position-z={-10}>
        <planeGeometry args={[context.width, context.height]}/>
        <meshBasicMaterial opacity={0.0} transparent={true}/>
      </mesh>
    </>
  }

  return <>
    <Bounds margin={1 + margin} fit={true} clip={true}>
      <_ViewPortHook/>
      {props.children}
    </Bounds>
  </>
}

export const Foreground = () => {
  const context = useThreeDContext()

  const model: any = useGLTF("/3d-models/the-scene-1/geometries.glb");
  const beerMug: any = useGLTF("/3d-models/beermug/geometries.glb");

  const models = useMemo(() => {
    const geometries = new THREE.IcosahedronGeometry(1, 60);
    const torus = new THREE.TorusGeometry(0.5, 0.5, 20, 20);
    const plane = new THREE.PlaneGeometry(
      context.width * 2.5,
      context.height * 2.5,
      10,
      10,
    );

    return [
      beerMug.scene.children[0].geometry,
      model.scene.children[0].geometry,
      torus,
      // plane
    ];
  }, []);

  const [modelIndex, updateModelIndex] = useState(1);
  const [enableBackgroud, updateEnableBackground] = useState(false);

  const onUpdateModelIndex = useCallback(() => {
    if (modelIndex >= models.length - 1) {
      updateModelIndex(0);
      updateEnableBackground(true);
    } else {
      updateModelIndex(modelIndex + 1);
    }
  }, [updateModelIndex, modelIndex, models]);

  const material = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: THREE.MeshStandardMaterial,
        wireframe: false,
        silent: true,
        vertexColors: true,
        fragmentShader: SHADERS.SimpleWobbleColorFragmentShader,
        vertexShader: SHADERS.SimpleWobbleColorVertexShader,
        uniforms: {
          uTime: { value: 0 },
          uStrength: { value: 0.15 },
          uColor: { value: new THREE.Color("#FFF6E9") },
        },
      }),
    [],
  );

  const textMaterial = useMemo(() => new CustomShaderMaterial({
    baseMaterial: THREE.MeshBasicMaterial
  }), [])

  useGlitchFrame(0.4, (tick) => {
    material.uniforms.uTime.value = tick.clock.getElapsedTime();
  });

  return (
    <>
      <Environment
        files={"/3d-models/the-scene-1/environment-tokio.hdr"}
        backgroundIntensity={10}
        background={true}
        environmentIntensity={10}
        backgroundRotation={[0, Math.PI * 0.5, 0]}
        environmentRotation={[0, Math.PI * 1.5, 0]}/>
        {/* <gridHelper args={[20 * 5, 20 * 5, '#7AB2B2', '#7AB2B2']} rotation-x={Math.PI * 0.5}/> */}
        <mesh position-z={-10}>
          <planeGeometry args={[context.width * 10, context.height * 10]}/>
          <meshBasicMaterial color={'#0E46A3'}/>
        </mesh>
        <NoiseTextBackground count={50}/>
        <ViewportComponent margin={0.1}>
          <Background/>
          <mesh position={[-2, 3.1, -1]}>
            <planeGeometry args={[3, 0.8]}/>
            <meshBasicMaterial args={[{color: 'green'}]}/>
          </mesh>
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Noise opacity={0.025} />
            {/* <Vignette eskil={false} offset={0.5} darkness={0.8} /> */}
          </EffectComposer>
          <Center disableY>
            <mesh material={material} position-z={-2}>
              <icosahedronGeometry args={[1.6, 20]} />
            </mesh>
            <TransformGeometry
              geometries={models}
              selectedIndex={modelIndex}
              duration={0.7}
              delay={0.5}
              scales={models.map((): number => 0.75)}
              onComplete={onUpdateModelIndex}
            />
          </Center>
        </ViewportComponent>
    </>
  );
};
