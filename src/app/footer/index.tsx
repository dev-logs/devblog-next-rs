import { Center, Text3D } from "@react-three/drei"
import { ThreeDCanvas } from "../components/canvas"
import { useMemo, useRef } from "react"
import Shaders from "../glsl"
import useGlitchFrame from "../hooks/use-glitch-frame"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { MeshBasicMaterial } from "three"

interface FooterProps {}

export const Footer = (props: FooterProps) => {
  return <>
    <div className="w-full h-[75vh] flex flex-col justify-between items-center">
      <ThreeDCanvas orthographic camera={{zoom: 85}}>
        <Implementation/>
      </ThreeDCanvas>
    </div>
  </>
}

export const Implementation = (props: FooterProps) => {
  const textRef: any = useRef(null)

  const textMaterial = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: MeshBasicMaterial,
      color: 'white',
      uniforms: {
        uTime: {value: 0},
        uStrength: {value: 0.5}
      }
    })
  }, [])

  useGlitchFrame(0.3, (tick) => {
    const clock = tick.clock
    const elapsed = clock.getElapsedTime()
    // textMaterial.uniforms.uTime.value = elapsed

    if (textRef.current) {
      textRef.current.rotation.x = elapsed * 0.1
    }
  })

  return <>
    <Center>
      <Text3D
        ref={textRef}
        font={"/fonts/graduate.typeface.json"}
        size={3}
        material={textMaterial}
        bevelSize={0.5}
        letterSpacing={-0.3}
        height={1}>
        DEVLOGS
      </Text3D>
    </Center>
  </>
}
