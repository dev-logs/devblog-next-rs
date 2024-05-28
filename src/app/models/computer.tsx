import { Bounds, Environment, Html, OrbitControls, useGLTF, useTexture } from "@react-three/drei"
import { forwardRef, useContext, useMemo } from "react"
import * as THREE from 'three'
import { LowVertexContext } from "./low-vertex"
import { TransformGeometry } from "./transform"
import noop from 'lodash/noop'

export interface ComputerWithFaceProps {}

export const ComputerWithFace = forwardRef((props: ComputerWithFaceProps & any, ref) => {
  const model = useGLTF('/3d-models/the-scene-1/geometries-computer-4.glb')
  const computerTexture = useTexture('/3d-models/the-scene-1/base-texture-computer-4.jpg')
  computerTexture.colorSpace = THREE.SRGBColorSpace
  computerTexture.flipY = false
  console.log(model)

  model.scene.traverse((c: any) => {
    c.material = new THREE.MeshBasicMaterial({
      map: computerTexture
    })
  })

  return <>
    <Environment
      files={"/3d-models/the-scene-1/environment-tokio.hdr"}
      environmentIntensity={10}
    />
    <primitive ref={ref} object={model.scene} scale={1} {...props}>{props.children}</primitive>
  </>
})

export interface ComputerWithFaceTransformProps extends ComputerWithFaceProps {

}

export const ComputerWithFaceTransform = (props: ComputerWithFaceTransformProps & any) => {
  const lowVertexModels: any = useContext(LowVertexContext)!
  const fromModel: any = lowVertexModels['paper-folded-carton'] as any
  const toModel: any = useGLTF('/3d-models/the-scene-1/geometries-computer-4.glb').scene.children[0]

  return <>
    <Environment
      preset="city"
      environmentIntensity={2}
    />
    <TransformGeometry
      geometries={[fromModel.geometry, toModel.geometry]}
      scales={[8, 8]}
      duration={2}
      delay={1.2}
      normalScale={0.2}
      glitchTimeout={0.1}
      selectedIndex={1}
      onComplete={noop}
      {...props}>
    </TransformGeometry>
  </>
}

useGLTF.preload('/3d-models/the-scene-1/geometries-computer-4.glb')
