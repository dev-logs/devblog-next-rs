import {Fragment, useMemo} from 'react'
import Shaders from '../glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {useGLTF} from '@react-three/drei'
import {Bloom, EffectComposer} from '@react-three/postprocessing'
import {Reponsive} from './reponsive'

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
        <pointLight position={[2.2, -7, 2]} intensity={60}/>
        <Reponsive>{
            (matches: any) => (<Fragment>
                {matches.small && <>
                    <mesh geometry={wireGeometry.scene.children[0].geometry} rotation-y={1} {...props}>
                        <meshStandardMaterial color={'orange'} emissive={'orange'} emissiveIntensity={0.9}/>
                    </mesh>
                </>}
                {matches.medium && <>
                    <mesh geometry={wireGeometry.scene.children[0].geometry} rotation-y={1} {...props}>
                        <meshStandardMaterial color={'orange'} emissive={'orange'} emissiveIntensity={0.9}/>
                    </mesh>
                </>}
            </Fragment>)}
        </Reponsive>
    </>
}
