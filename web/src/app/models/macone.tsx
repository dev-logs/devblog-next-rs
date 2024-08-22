import {useGLTF, useTexture} from "@react-three/drei"
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import {forwardRef, useEffect, useMemo} from "react"
import {useFrame} from "@react-three/fiber";
import Shaders from "@/app/glsl";

export const MacOne = forwardRef((props: any, ref) => {
    const {screenMaterial, bodyMaterial} = props || {}

    const model = useGLTF(`${process.env.PATH_PREFIX}${process.env.PATH_PREFIX}/3d-models/macone/geometries2.glb`)
    const helloWorldLCD = useTexture(`${process.env.PATH_PREFIX}/images/hello-world-lcd.jpg`)
    helloWorldLCD.colorSpace = THREE.SRGBColorSpace
    helloWorldLCD.wrapS = THREE.RepeatWrapping
    helloWorldLCD.wrapT = THREE.RepeatWrapping

    const [shineMaterial] = useMemo(() => {
        const shineMaterial = new THREE.MeshStandardMaterial({
            color: '#DDDDDD',
            metalness: 1.1,
            roughness: 0.0,
            emissive: '#DDDDDD',
            emissiveIntensity: 1.05
        })

        return [shineMaterial]
    }, [])

    const [bottomTagMaterial]: any = useMemo(() => {
        let bottomTagMaterial
        model.scene.traverse((c: any) => {
            if (c.name === 'Body001') {
                c.material = bodyMaterial || new THREE.MeshBasicMaterial({
                })
            } else if (c.name === 'Screen007') {
                c.material = screenMaterial || new CustomShaderMaterial({
                    baseMaterial: THREE.MeshStandardMaterial,
                    color: '#E0C097'
                })
            }
            else if (c.name === 'Disk') {
                c.material = new THREE.MeshStandardMaterial({
                    color: 'black',
                    metalness: 0.8,
                    emissive: 'white',
                    emissiveIntensity: 0.1,
                })
            }
            else if (c.name === 'Logo002') {
                c.material = new THREE.MeshStandardMaterial({
                    color: 'white',
                    metalness: 1,
                    roughness: 0.0,
                    side: THREE.DoubleSide
                })
            }
            else if (c.name === 'tag') {
                c.material = shineMaterial
            }
            else if (c.name === 'bottom-tag') {
                c.geometry = new THREE.PlaneGeometry(0.04, 0.02)
                c.material = new CustomShaderMaterial({
                    baseMaterial: THREE.MeshStandardMaterial,
                    vertexShader: Shaders.MacOneLCDVertexShader,
                    fragmentShader: Shaders.MacOneLCDFragmentShader,
                    uniforms: {
                        uTime: {value: 0},
                        uTexture: {value: helloWorldLCD}
                    }
                })

                bottomTagMaterial = c.material
            }
        })

        return [bottomTagMaterial]
    }, [screenMaterial, bodyMaterial, shineMaterial])

    useFrame((tick) => {
        const clock = tick.clock
        const elapsedTime = clock.getElapsedTime()

        if (bottomTagMaterial) {
          bottomTagMaterial.uniforms.uTime.value = elapsedTime
        }
    })

    return <>
        <primitive ref={ref} {...props} object={model.scene}/>
    </>
})

useGLTF.preload(`${process.env.PATH_PREFIX}/3d-models/macone/geometries2.glb`)
useTexture.preload(`${process.env.PATH_PREFIX}/images/hello-world-lcd.jpg`)
