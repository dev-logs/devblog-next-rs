import React, { useMemo, useContext, createContext, ReactNode, forwardRef, useEffect } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import * as THREE from 'three'

interface GLTFNodes {
  [key: string]: THREE.Mesh
  'paper-unfolded-carton': THREE.Mesh
  'paper-folded-carton': THREE.Mesh
  'paper-airplane': THREE.Mesh
  apple: THREE.Mesh
  bread: THREE.Mesh
  'paper-flour-pack': THREE.Mesh
  'paper-milk-pack': THREE.Mesh
  sanwitch: THREE.Mesh
}

const context = createContext<GLTFNodes | null>(null)

interface InstancesProps extends GroupProps {
  children: ReactNode
}

export function LowVertexModelProvider({ children, ...props }: InstancesProps) {
  const {scene} = useGLTF('3d-models/low-vertex/geometries.glb')

  const instances = useMemo(() => scene.children.reduce((obj: any, curr) => {
    obj[curr.name] = curr
    return obj
  }, {}), [scene])

  return (
    <context.Provider value={instances}>{children}</context.Provider>
  )
}

interface LowVertexModelProps extends GroupProps {
  name: string
  material?: any
  materialProvider?: any
}

export const LowVertexModel = forwardRef((props: LowVertexModelProps, ref) => {
  const {name, material, materialProvider} = props
  const instances = useContext(context)

  if (!instances) {
    return null
  }

  const InstanceNode = instances[name] as any
  if (!InstanceNode) {
    return null
  }

  if (material) {
    InstanceNode.material = material
  }

  if (materialProvider) {
    InstanceNode.material = materialProvider(InstanceNode)
  }

  return (
    <primitive {...props} object={InstanceNode} ref={ref}/>
  )
})

LowVertexModel.displayName = 'LowVertexModel'

useGLTF.preload('/3d-models/low-vertex/geometries.glb')
