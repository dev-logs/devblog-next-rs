import {Fragment, useMemo} from 'react'
import Shaders from '../glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {useGLTF} from '@react-three/drei'
import {Bloom, EffectComposer} from '@react-three/postprocessing'
import {Reponsive, reponsiveMatch, WidthReponsive} from './reponsive'

interface ElectricalEffectProps {
    position: any,
    scale: any
}

export const ElectricalEffect = (props: ElectricalEffectProps) => {
    const [material, geometry, wireGeometry]: any = useMemo(() => {
        const wireGeometry = useGLTF('/3d-models/bloom/geometries.glb')

        const material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            transparent: true,
            silent: true,
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
        <EffectComposer enableNormalPass={false} resolutionScale={1}>
            <Bloom intensity={0.3} luminanceThreshold={1.1} mipmapBlur/>
        </EffectComposer>
        <Reponsive>{
        (matches: any) => {
          const match = reponsiveMatch(matches)
          return <Fragment>
            {match.is(WidthReponsive.SMALL) && <>
              <mesh geometry={wireGeometry.scene.children[0].geometry} rotation-y={1} {...props}>
                <meshStandardMaterial color={'orange'} emissive={'orange'} emissiveIntensity={2} />
              </mesh>
            </>}
            {match.from(WidthReponsive.MEDIUM) && <>
              <mesh geometry={wireGeometry.scene.children[0].geometry} rotation-y={1} {...props}>
                <meshStandardMaterial color={'orange'} emissive={'orange'} emissiveIntensity={2} />
              </mesh>
            </>}
          </Fragment>
        }
        }
        </Reponsive>
    </>
}

useGLTF.preload('/3d-models/bloom/geometries.glb')
