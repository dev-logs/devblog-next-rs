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
    const Implementation = () => {
        const context = new ThreeD()
        return <LowVertexModelProvider>
            <ThreeDContext.Provider value={context}>
                {props.background || <></>}
                {props.scroll ? <ScrollControls damping={0.2} maxSpeed={0.5} {...props.scroll}>
                    {props.children}
                </ScrollControls> : props.children}
            </ThreeDContext.Provider>
        </LowVertexModelProvider>
    }

    return <Canvas
        gl={{
          antialias: false,
          alpha: false,
          preserveDrawingBuffer: true,
          ...(props.gl || {})
        }}
        shadows={false}
        dpr={1}
        ref={ref} {...omit(props, ['children', 'gl'])}>
        <Implementation/>
    </Canvas>
})
