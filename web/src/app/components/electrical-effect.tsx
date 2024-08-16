import {Fragment, useMemo} from 'react'
import Shaders from '../glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {Environment, Stage, TransformControls, useGLTF, useTexture} from '@react-three/drei'
import {Bloom, EffectComposer} from '@react-three/postprocessing'
import {Reponsive, reponsiveMatch, WidthReponsive} from './reponsive'
import { useFrame, useThree } from '@react-three/fiber'

interface ElectricalEffectProps {
    position: any,
    scale: any
}

export const ElectricalEffect = (props: ElectricalEffectProps) => {
    const woodTexture = useTexture('/3d-models/bloom/wood.jpg')
    woodTexture.colorSpace = THREE.SRGBColorSpace
    const [geometry, wireGeometry, bulb]: any = useMemo(() => {
        const wireGeometry = useGLTF('/3d-models/bloom/bulb.glb')

        const metalMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.15,
          color: 'grey',
        })

        const woodMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.1,
          roughness: 0.7,
          map: woodTexture
        })

        const glassMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.7,
          roughness: 0.15,
          transparent: true,
          opacity: 0.1,
          color: 'grey'
        })

        const glassInnerMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.0,
          side: THREE.DoubleSide,
          opacity: 1,
          color: 'black'
        })

        const filamentMaterial = new THREE.MeshStandardMaterial({
          metalness: 1,
          roughness: 0,
          color: 'orange',
          emissive: 'orange',
          side: THREE.DoubleSide,
          emissiveIntensity: 300
        })

        let topGroup: any | undefined

        wireGeometry.scene.traverse((child: any) => {
          child.receiveShadow = true
          child.castShadow = true
          if (child.name.startsWith('metal')) {
            child.material = metalMaterial
            child.castShadow = true
          }
          if(child.name === 'glass_inner') {
           child.material = glassInnerMaterial
          }
          else if (child.name.startsWith('glass')) {
            child.material = glassMaterial
            topGroup = child
            child.castShadow = true
            child.receiveShadow = true
          }
          else if (child.name.startsWith('wood')) {
            child.material = woodMaterial
            child.receiveShadow = true
          }
          else if (child.name === 'filament001') {
            child.material = filamentMaterial
            child.castShadow = true
          }
          else if (child.name === 'rele') {
            child.material = filamentMaterial
          }
          else {
            console.log('found redundant', child)
          }
        })

        const geometry = new THREE.PlaneGeometry(5, 1, 25, 25)
        return [geometry, wireGeometry, topGroup]
    }, [])

    useFrame((tick) => {
      const clock = tick.clock
      const elapsed = clock.getElapsedTime()
      if (bulb) {
        bulb.rotation.y = elapsed * 0.5
        bulb.rotation.x = Math.sin(elapsed * 0.4) * 0.1
        bulb.rotation.z = Math.cos(elapsed * 0.4) * 0.1
      }
    })

    return <>
      <EffectComposer enableNormalPass={false} resolutionScale={1}>
        <Bloom intensity={0.1} luminanceThreshold={0.2} mipmapBlur/>
      </EffectComposer>
      <primitive object={wireGeometry.scene} rotation-x={0.05} position={[2, -7.8, 0]} scale={20}/>
    </>
}

useTexture.preload('/3d-models/bloom/wood.jpg')
useGLTF.preload('/3d-models/bloom/bulb.glb')
