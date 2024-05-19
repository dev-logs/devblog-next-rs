'use client'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, extend as threeFiberExtend, useFrame } from '@react-three/fiber'
import { Bounds, Box, Environment, Outlines, Resize, ScreenSizer, Text3D, useGLTF, useTexture } from '@react-three/drei'
import noop from 'lodash/noop'
import SHADERS from '../glsl'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {
  Vignette,
  EffectComposer,
  Bloom,
  Noise
} from '@react-three/postprocessing'
import gsap from 'gsap'
import { useMemo } from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import useGlitchFrame from '../hooks/use-glitch-frame'
import useGlitch from '../hooks/use-glitch'

threeFiberExtend(CustomShaderMaterial)

export class BlogListProps {}

export const BlogList = (props: BlogListProps) => {
  return (
    <div className='relative flex flex-row h-full w-full'>
      <div className='w-full h-full'>
        <Canvas>
          <CanvasBackground />
        </Canvas>
      </div>
      <div
        className='absolute top-0 left-0
                   w-full h-full bg-transparent flex flex-row justify-start items-start p-20 hidden collapse'>
        <div className='flex flex-col w-[20vw] h-full rounded-lg'>
          <div className='bg-gray-950 bg-opacity-50 pl-10 pt-10 rounded-tl-lg'>
            <p className='text-3xl font-bold'>Devlog</p>
            <p className='text-sm'>studio</p>
            <p className='text-5xl font-bold mt-20'>BLOgs</p>
            <div className='flex flex-row gap-5 mt-28'>
              <p>Engineer</p>
              <p>Life</p>
            </div>
          </div>
          <div className='w-full h-full border-[30px] rounded-b-lg border-opacity-50 border-gray-950'>
          </div>
        </div>
        <div className='w-full h-full bg-gray-950 bg-opacity-50 p-10 rounded-tr-lg rounded br-lg'>
        </div>
      </div>
    </div>
  )
}

export class TransformGeometryProps {
  geometries: Array<THREE.BufferGeometry> = []
  selectedIndex: number = 0
  delay: number = 0
  duration: number = 0
  scales: Array<number> = []
  onComplete: Function = noop
}

export const TransformGeometry = (props: TransformGeometryProps) => {
  let {
    geometries,
    selectedIndex,
    delay,
    duration,
    scales,
    onComplete
  } = props

  const map = useTexture('/3d-models/the-scene-1/environment-tokio.jpg')
  map.colorSpace = THREE.SRGBColorSpace

  const { mesh, material, updateAttributes, saveAnimation } = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader: SHADERS.PointerVertexShader,
      fragmentShader: SHADERS.PointerFragmentShader,
      metalness: 0.0,
      roughness: 0.0,
      color: '#ffffff',
      wireframe: false,
      silent: true,
      vertexColors: true,
      map,
      uniforms: {
        uTime: {value: 0.0}
      }
    })

    const nonIndexedGeometries = geometries.map((geo) => {
      const geometry = geo.toNonIndexed()
      return geometry
    })

    const maxVertexCount = Math.max(
      ...nonIndexedGeometries.map((geo) => geo.attributes.position.count),
    )

    const vertexArrays = nonIndexedGeometries.map((geo) => {
      const vertices = geo.attributes.position.array
      const normals = geo.attributes.normal.array
      const uvs = geo.attributes.uv
        ? geo.attributes.uv.array
        : new Float32Array((vertices.length / 3) * 2)

      if (geo.attributes.position.count < maxVertexCount) {
        const extendedVertices = new Float32Array(maxVertexCount * 3)
        const extendedNormals = new Float32Array(maxVertexCount * 3)
        const extendedUvs = new Float32Array(maxVertexCount * 2)
        extendedVertices.set(vertices)
        extendedNormals.set(normals)
        extendedUvs.set(uvs)
        return {
          vertices: extendedVertices,
          normals: extendedNormals,
          uvs: extendedUvs
        }
      }
      return { vertices, normals, uvs }
    })

    const baseGeometry = new THREE.BufferGeometry()
    const basePosition = new THREE.BufferAttribute(new Float32Array(maxVertexCount * 3), 3)
    basePosition.array.set(vertexArrays[0].vertices)
    const baseNormal = new THREE.BufferAttribute(new Float32Array(maxVertexCount * 3), 3)
    baseNormal.array.set(vertexArrays[0].normals)
    const baseUv = new THREE.BufferAttribute(new Float32Array(maxVertexCount * 3), 2)
    baseUv.array.set(vertexArrays[0].uvs)

    baseGeometry.setAttribute('position', basePosition)
    baseGeometry.setAttribute('normal', baseNormal)
    baseGeometry.setAttribute('uv', baseUv)

    const aPosition2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    )

    const aNormal2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    )

    const aUv2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 2),
      2,
    )

    baseGeometry.setAttribute('aPosition2', aPosition2)
    baseGeometry.setAttribute('aNormal2', aNormal2)
    baseGeometry.setAttribute('aUv2', aUv2)

    const updateAttributes = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return
      }

      const targetVertices = vertexArrays[index].vertices
      const targetNormals = vertexArrays[index].normals
      const targetUvs = vertexArrays[index].uvs

      aPosition2.array.set(targetVertices)
      aNormal2.array.set(targetNormals)
      aUv2.array.set(targetUvs)
      aPosition2.needsUpdate = true
      aNormal2.needsUpdate = true
      aUv2.needsUpdate = true
    }

    const saveAnimation = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return
      }

      const targetVertices = vertexArrays[index].vertices
      const targetNormals = vertexArrays[index].normals
      const targetUvs = vertexArrays[index].uvs

      basePosition.array.set(targetVertices)
      baseNormal.array.set(targetNormals)
      baseUv.array.set(targetUvs)
      basePosition.needsUpdate = true
      baseNormal.needsUpdate = true
      baseUv.needsUpdate = true
      material.uniforms.uTime.value = 0
    }

    return {
      mesh: new THREE.Mesh(baseGeometry, material),
      material,
      geometry: baseGeometry,
      updateAttributes,
      saveAnimation
    }
  }, [])

  const glitch = useGlitch(0.1, (value) => {
    material.uniforms.uTime.value = value
  }, [selectedIndex, updateAttributes, material])

  useEffect(() => {
    const gsapGlitch = {value: 0}
    updateAttributes(selectedIndex)
    gsap.fromTo(
      gsapGlitch,
      { value: 0 },
      {
        value: 1,
        duration,
        delay,
        ease: 'power2.in',
        onUpdate: () => {
          glitch(gsapGlitch.value)
        },
        onComplete: () => {
          saveAnimation(selectedIndex)
          onComplete()
        }
      },
    )
  }, [selectedIndex, material, updateAttributes])

  return (
    <>
      <primitive
        object={mesh}
        position-z={-2.8}
        scale={scales[selectedIndex] || 1}
      />
    </>
  )
}

export const CanvasBackground = () => {
  const {viewport} = useThree()

  const model: any = useGLTF('/3d-models/the-scene-1/geometries.glb')
  const beerMug: any = useGLTF('/3d-models/beermug/geometries.glb')

  const models = useMemo(() => {
    const geometries = new THREE.IcosahedronGeometry(1, 60)
    const torus = new THREE.TorusGeometry(0.5, 0.5, 20, 20)
    const plane = new THREE.PlaneGeometry(viewport.width * 2.5, viewport.height * 2.5, 10, 10)

    return [
      beerMug.scene.children[0].geometry,
      model.scene.children[0].geometry,
      torus
      // plane
    ]
  }, [])

  const [modelIndex, updateModelIndex] = useState(1)
  const [enableBackgroud, updateEnableBackground] = useState(false)

  const onUpdateModelIndex = useCallback(() => {
    if (modelIndex >= models.length - 1) {
      updateModelIndex(0)
      updateEnableBackground(true)
    } else {
      updateModelIndex(modelIndex + 1)
    }
  }, [updateModelIndex, modelIndex, models])

  const material = useMemo(() => new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    color: '#ffffff',
    wireframe: false,
    silent: true,
    vertexColors: true,
    fragmentShader: SHADERS.SimpleWobbleFragmentShader,
    vertexShader: SHADERS.SimpleWobbleVertexShader,
    uniforms: {
      uTime: {value: 0},
      uStrength: {value: 0.15}
    }
  }), [])

  useGlitchFrame(0.4, (tick) => {
    material.uniforms.uTime.value = tick.clock.getElapsedTime()
  })

  return (
    <>
      <Environment
        files={'/3d-models/the-scene-1/environment-tokio.hdr'}
        backgroundIntensity={1.1}
        environmentIntensity={100}
        // background={}
        backgroundRotation={[0, Math.PI * 0.5, 0]}
        environmentRotation={[0, Math.PI * 1.5, 0]}
      />
      <mesh position-z={-6}>
        <meshBasicMaterial color={'gray'}/>
        <planeGeometry args={[viewport.width * 6 * 2, viewport.height * 6 * 2]}/>
      </mesh>
      <mesh material={material} position-z={-6.0}>
        <icosahedronGeometry args={[3, 20]}/>
      </mesh>
      <Bounds fit clip observe margin={1.0} maxDuration={1}>
      <Text3D
        material={material}
        font="/fonts/helvetiker_regular.typeface.json"
        size={ 1 }
        height={ 0.2 }
        curveSegments={ 12 }
        bevelEnabled
        bevelThickness={ 0.02 }
        bevelSize={ 0.02 }
        bevelOffset={ 0 }
        bevelSegments={ 5 }
        position={[-3, 2.4, 1]}>
        DEVLOGS
        <Outlines thickness={0.05} color="black" />
      </Text3D>
      <Text3D
        material={material}
        font="/fonts/helvetiker_regular.typeface.json"
        size={ 1 }
        height={ 0.2 }
        curveSegments={ 12 }
        bevelEnabled
        bevelThickness={ 0.02 }
        bevelSize={ 0.02 }
        bevelOffset={ 0 }
        bevelSegments={ 5 }
        position={[-3, -3.4, 1]}>
        Studio
      </Text3D>
      </Bounds>
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          height={300}
          opacity={3}
        />
        {<>!enableBackgroud && <Noise opacity={0.125}/></>}
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
      </EffectComposer>
      {<>!enableBackgroud && <TransformGeometry
        geometries={models}
        selectedIndex={modelIndex}
        duration={2}
        delay={0.5}
        onComplete={onUpdateModelIndex}
        scales={[]}
      /></>}
    </>
  )
}
