import { Environment, useGLTF } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import * as THREE from 'three'

export default function Keyboard(props: any) {
  const {} = props || {}

  const model = useGLTF(`${process.env.NEXT_PUBLIC_PATH_PREFIX}3d-models/keyboard/geometries.glb`)

  useEffect(() => {
    model.scene.traverse((c: any) => {
      // c.material = new THREE.MeshStandardMaterial({
      //   color: '#EFEFEF',
      //   metalness: 0.1,
      //   roughness: 0.8
      // })
    })
  }, [model])

  return <>
    <Environment files={`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/warehouse.hdr`} environmentIntensity={3}/>
    <primitive {...props} object={model.scene}/>
  </>
}

useGLTF.preload(`${process.env.NEXT_PUBLIC_PATH_PREFIX}3d-models/keyboard/geometries.glb`)
