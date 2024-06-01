import {useMemo} from 'react'
import Shaders from '../glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { useGLTF } from '@react-three/drei'
import { Bloom, Noise, Glitch, ToneMapping, Vignette, EffectComposer } from '@react-three/postprocessing'

interface ElectricalEffectProps {
  position: any
}

export const ElectricalEffect = (props: ElectricalEffectProps) => {
  const [material, geometry, wireGeometry]: any = useMemo(() => {
    const wireGeometry = useGLTF('/3d-models/bloom/geometries.glb')
    console.log('debug', wireGeometry)

    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: Shaders.ElectricalEffectVertexShader,
      fragmentShader: Shaders.ElectricalEffectFragmentShader,
      uniforms: {
        uTime: {value: 0},
        uColor: {value: new THREE.Color('#FF6D02')},
        uStrength: {value: 0.5}
      }
    })

    const geometry = new THREE.PlaneGeometry(5, 1, 25, 25)
    return [material, geometry, wireGeometry]
  }, [])

  return <>
    <EffectComposer>
      <Bloom luminanceThreshold={ 1.1 } mipmapBlur intensity={0.5}/>
    </EffectComposer>
    <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
    <ambientLight intensity={ 4.1 } />
    {/* <primitive object={wireGeometry.scene} {...props}/> */}
    <mesh geometry={wireGeometry.scene.children[0].geometry} rotation-y={1} scale={0.5} {...props}>
      <meshStandardMaterial color={'orange'} emissive={'orange'} emissiveIntensity={0.9} side={THREE.DoubleSide} />
    </mesh>
  </>
}
