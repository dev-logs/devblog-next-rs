import {DependencyList, useEffect, useRef} from 'react'

const useGlitch = (timeout: number, callback: (value: number) => void, deps: DependencyList) => {
    const currentGlitchRef = useRef(0)
    const prevValueRef = useRef(0)

    useEffect(() => {
        prevValueRef.current = 0
        currentGlitchRef.current = 0
    }, deps)

    const glitch = (value: number) => {
        let currentGlitch = currentGlitchRef.current
        const prevValue = prevValueRef.current

        if (currentGlitch >= timeout) {
            callback(value)
            currentGlitch = 0
        } else {
            currentGlitch += value - prevValue
        }

        currentGlitchRef.current = currentGlitch
        prevValueRef.current = value
    }

    return glitch
}

export default useGlitch
