import * as THREE from 'three'
import {useMemo} from 'react'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {MacOne} from '../models/macone'
import Shaders from '../glsl'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

export const Tivi = (props: any) => {
  const beerMugTexture = useTexture('/images/beermug.jpg')
  beerMugTexture.colorSpace = THREE.SRGBColorSpace
  beerMugTexture.flipY = false

  const [screenMaterial]: any = useMemo(() => {
    const screenMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: Shaders.TvVertexShader,
      fragmentShader: Shaders.TvFragmentShader,
      uniforms: {
        uTime: {value: 0},
        uPicture: {value: beerMugTexture}
      }
    })

    return [screenMaterial]
  }, [])

  useFrame((tick) => {
    const clock = tick.clock
    const elapsedTime = clock.getElapsedTime()
    screenMaterial.uniforms.uTime.value = elapsedTime
  })

  return <>
    <MacOne screenMaterial={screenMaterial} cloneScreen {...props}/>
  </>
}
