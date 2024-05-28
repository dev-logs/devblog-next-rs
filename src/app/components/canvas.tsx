import { Canvas, CanvasProps, useThree } from "@react-three/fiber"
import { forwardRef } from "react"
import { ThreeD, ThreeDContext } from "../contexts"
import { omit } from "lodash"
import { LowVertexModelProvider } from "../models/low-vertex"

export interface ThreeDCanvasProps extends CanvasProps {

}

export const ThreeDCanvas = forwardRef((
  props: ThreeDCanvasProps &
  React.RefAttributes<HTMLCanvasElement>, ref: any) => {
  const Implementation = () => {
    const {viewport} = useThree()
    const context = new ThreeD({scale: 10, viewport})
    return <LowVertexModelProvider>
      <ThreeDContext.Provider value={context}>
        {props.children}
      </ThreeDContext.Provider>
    </LowVertexModelProvider>
  }

  return <Canvas ref={ref} {...omit(props, ['children'])}>
    <Implementation/>
  </Canvas>
})
