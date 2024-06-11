import {useGLTF, useTexture} from "@react-three/drei"
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import {useEffect} from "react"

export const MacOne = (props: any) => {
    const {screenMaterial, bodyMaterial} = props || {}

    const model = useGLTF('/3d-models/macone/geometries.glb')
    const texture = useTexture('/3d-models/macone/body-texture.jpg')
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false

    useEffect(() => {
        model.scene.traverse((c: any) => {
            if (c.name === 'Body') {
                c.material = bodyMaterial || new THREE.MeshBasicMaterial({
                    map: texture
                })
            } else if (c.name === 'Screen') {
                c.material = screenMaterial || new CustomShaderMaterial({
                    baseMaterial: THREE.MeshStandardMaterial,
                    emissiveIntensity: 0.1,
                    emissive: '#E0C097',
                    color: '#E0C097'
                })
            }
        })
    }, [screenMaterial])

    return <>
        <primitive {...props} object={model.scene}/>
    </>
}
