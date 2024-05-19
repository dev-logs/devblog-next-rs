import { useRef } from 'react'
import { RenderCallback, useFrame } from '@react-three/fiber'

const useGlitchFrame = (glitchTimeout: number, onGlitch: RenderCallback) => {
  const currentGlitchRef = useRef(0)

  useFrame((tick, delta, frame) => {
    let currentGlitch = currentGlitchRef.current

    if (glitchTimeout < currentGlitch) {
      currentGlitch = 0
    }
    else {
      currentGlitch += delta
    }

    if (currentGlitch === 0) {
      onGlitch(tick, delta, frame)
    }

    currentGlitchRef.current = currentGlitch
  })
}

export default useGlitchFrame
