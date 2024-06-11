import {useRef} from 'react'
import {RenderCallback, useFrame} from '@react-three/fiber'

const useGlitchFrame = (glitchTimeout: number, onGlitch: RenderCallback) => {
    const currentGlitchRef = useRef({val: 0})

    useFrame((tick, delta, frame) => {
        let currentGlitch = currentGlitchRef.current.val

        if (glitchTimeout < currentGlitch) {
            currentGlitch = 0
        } else {
            currentGlitch += delta
        }

        if (currentGlitch === 0) {
            onGlitch(tick, delta, frame)
        }

        currentGlitchRef.current.val = currentGlitch
    })
}

export default useGlitchFrame
