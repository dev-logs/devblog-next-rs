import {createContext, useContext, useEffect, useInsertionEffect} from 'react'
import MousePosition from './MousePosition'
import {useThree} from '@react-three/fiber'

export class ThreeD {
  mousePosition: MousePosition
  scale: number
  aspect: number = 1
  width: number = 0
  height: number = 0

  constructor(props: {scale: number, viewport: any}) {
    this.mousePosition = new MousePosition(0, 0)
    this.scale = props.scale
    this.updateViewport(props.viewport)
  }

  updateMousePosition(mousePosition: MousePosition) {
    this.mousePosition.x = mousePosition.x
    this.mousePosition.y = mousePosition.y
  }

  updateViewport(viewport: any) {
    this.height = this.scale
    this.width = viewport.aspect * this.scale
    this.aspect = viewport.aspect
  }
}

export const ThreeDContext = createContext<ThreeD | null>(null)

export const useThreeDContext = () => {
  const context = useContext(ThreeDContext)!
  const {viewport} = useThree()

  useEffect(() => {
    context.updateViewport(viewport)
  }, [viewport])

  return context
}
