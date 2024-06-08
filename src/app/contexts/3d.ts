import {createContext, useContext, useEffect, useInsertionEffect} from 'react'
import MousePosition from './MousePosition'
import {useThree} from '@react-three/fiber'

export class ThreeD {
  mousePosition: MousePosition

  constructor() {
    this.mousePosition = new MousePosition(0, 0)
  }

  updateMousePosition(mousePosition: MousePosition) {
    this.mousePosition.x = mousePosition.x
    this.mousePosition.y = mousePosition.y
  }
}

export const ThreeDContext = createContext<ThreeD | null>(null)

export const useThreeDContext = () => {
  const context = useContext(ThreeDContext)!
  const {viewport} = useThree()

  useEffect(() => {
    // context.updateViewport(viewport)
  }, [viewport])

  return context
}
