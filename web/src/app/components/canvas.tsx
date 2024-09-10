import {Canvas, CanvasProps} from "@react-three/fiber"
import {forwardRef, ReactNode} from "react"
import {ThreeD, ThreeDContext} from "../contexts"
import {omit} from "lodash"
import {LowVertexModelProvider} from "../models/low-vertex"
import {ScrollControls, ScrollControlsProps} from "@react-three/drei"

export interface ThreeDCanvasProps extends CanvasProps {
    scroll?: ScrollControlsProps | {}
    background?: ReactNode
}

export const ThreeDCanvas = forwardRef((
    props: ThreeDCanvasProps &
        React.RefAttributes<HTMLCanvasElement>, ref: any) => {
    return <Canvas
        gl={{
          alpha: false,
          preserveDrawingBuffer: false,
          antialias: false,
          ...(props.gl || {})
        }}
        ref={ref} {...omit(props, ['children', 'gl'])}>
        {props.children}
    </Canvas>
})
