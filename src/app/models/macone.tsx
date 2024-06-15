import {useGLTF, useTexture} from "@react-three/drei"
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import {forwardRef, useEffect, useMemo} from "react"

export const MacOne = forwardRef((props: any, ref) => {
    const {screenMaterial, bodyMaterial} = props || {}

    const model = useGLTF('/3d-models/macone/geometries2.glb')
    const texture = useTexture('/3d-models/macone/body-texture.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = true

    const [shineMaterial] = useMemo(() => {
        const shineMaterial = new THREE.MeshStandardMaterial({
            color: '#DDDDDD',
            metalness: 1,
            roughness: 0.1,
            emissive: '#DDDDDD',
            emissiveIntensity: 1
        })

        return [shineMaterial]
    }, [])

    useEffect(() => {
        model.scene.traverse((c: any) => {
            if (c.name === 'Body001') {
                c.material = bodyMaterial || new THREE.MeshBasicMaterial({
                    map: texture
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
                c.material = new THREE.MeshBasicMaterial({
                    color: 'black',
                    transparent: true,
                    opacity: 0.8
                })
            }
            else if (c.name === 'tag') {
                c.material = shineMaterial
            }
            else if (c.name === 'bottom-tag') {
                c.material = shineMaterial
            }
        })
    }, [screenMaterial, bodyMaterial, shineMaterial])

    return <>
        <primitive ref={ref} {...props} object={model.scene}/>
    </>
})
