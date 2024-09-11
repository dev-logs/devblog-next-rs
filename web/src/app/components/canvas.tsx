import {Canvas, CanvasProps} from "@react-three/fiber"
import {forwardRef, ReactNode} from "react"
import {omit} from "lodash"

export interface ThreeDCanvasProps extends CanvasProps {
    background?: ReactNode
}

export const ThreeDCanvas = forwardRef((
    props: ThreeDCanvasProps &
        React.RefAttributes<HTMLCanvasElement>, ref: any) => {
    return <Canvas
        gl={{
          alpha: false,
          preserveDrawingBuffer: true,
          antialias: false,
          ...(props.gl || {})
        }}
        ref={ref} {...omit(props, ['children', 'gl'])}>
        {props.children}
    </Canvas>
})
