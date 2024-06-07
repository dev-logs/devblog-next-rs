import { Text } from '@react-three/drei'
import { MeshHolder } from './mesh-holder'
import { forwardRef } from 'react'
import { ThreeDCanvas } from './canvas'

export const Footer3d = forwardRef((props: any, ref) => {
  return <>
    <Text ref={ref} color="white" anchorX="center" font='/fonts/damn.ttf' anchorY="middle" fontSize={3.5} rotation-x={Math.PI * -0.2}>
      {"  BE CREATIVE"}
    </Text>
  </>
})

export const FooterHtml = (props: any) => {
  const {footer3dRef = {}, viewport, scrollData} = props || {}

  return <>
    <div className={`flex flex-col h-screen w-screen`}>
      <span className='text-white text-9xl'>Hello</span>
      <MeshHolder scrollData={scrollData} viewport={viewport} meshRef={footer3dRef} className="h-full w-full">
        Here is the holder
      </MeshHolder>
    </div>
  </>
}
