import React, { useEffect, useRef, useState } from 'react'
import RiveCanvas from '@rive-app/canvas-advanced'
import { noop } from 'lodash'

const RIVE_VERSION = '2.7.3'

export class RiveApp {
  private _rive: any

  constructor(rive: any) {
    this._rive = rive
  }

  get rive() {
    return this._rive
  }

  static async init() {
    const rive = await RiveCanvas({
      locateFile: () =>
        `https://unpkg.com/@rive-app/canvas-advanced@${RIVE_VERSION}/rive.wasm`,
    })

    const instance = new RiveApp(rive)
    return instance
  }

  requestRenderLoop(callback: (params: { time: number, deltaTime: number }) => void) {
    let lastTime = 0

    const renderLoop = (time: number) => {
      if (!lastTime) {
        lastTime = time
      }

      const deltaTime = time - lastTime
      lastTime = time
      callback({ time, deltaTime })
      this.rive.requestAnimationFrame(renderLoop)
    }

    this.rive.requestAnimationFrame(renderLoop)
  }
}

type RiveComponentProps = {
  setRiveRuntime?: (runtime: RiveRuntime) => void,
  rivFileUrl: string
  state: string
  artboardName: string
  fit?: string
  alignment?: string
}

type RiveRuntime = {
  artboard?: any
  stateMachine?: any
}

export const RiveComponent: React.FC<RiveComponentProps> = ({
  setRiveRuntime = noop,
  rivFileUrl,
  state,
  artboardName,
  fit = 'contain',
  alignment = 'center',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const riveAppRef = useRef<RiveApp | null>(null)
  const [riveInstance, setRiveInstance] = useState<any>(null)
  const [artboard, setArtboard] = useState<any>(null)
  const [stateMachine, setStateMachine] = useState<any>(null)

  const registerListeners = (canvas: HTMLCanvasElement, rive: any, artboard: any, stateMachine: any) => {
    const fitValue = rive.Fit[fit]
    const alignmentValue = rive.Alignment[alignment]

    const mouseCallback = (event: MouseEvent) => {
      const boundingRect = canvas.getBoundingClientRect()

      const canvasX = event.clientX - boundingRect.left
      const canvasY = event.clientY - boundingRect.top
      const forwardMatrix = rive.computeAlignment(
        fitValue,
        alignmentValue,
        {
          minX: 0,
          minY: 0,
          maxX: boundingRect.width,
          maxY: boundingRect.height,
        },
        artboard.bounds
      )

      let invertedMatrix = new rive.Mat2D()
      forwardMatrix.invert(invertedMatrix)
      const canvasCoordinatesVector = new rive.Vec2D(canvasX, canvasY)
      const transformedVector = rive.mapXY(invertedMatrix, canvasCoordinatesVector)

      const transformedX = transformedVector.x()
      const transformedY = transformedVector.y()

      switch (event.type) {
        case 'mousemove':
          stateMachine.pointerMove(transformedX, transformedY)
          break
        case 'mousedown':
          stateMachine.pointerDown(transformedX, transformedY)
          break
        case 'mouseup':
          stateMachine.pointerUp(transformedX, transformedY)
          break
        default:
      }
    }

    canvas.addEventListener('mousemove', mouseCallback)
    canvas.addEventListener('mousedown', mouseCallback)
    canvas.addEventListener('mouseup', mouseCallback)

    return () => {
      canvas.removeEventListener('mousemove', mouseCallback)
      canvas.removeEventListener('mousedown', mouseCallback)
      canvas.removeEventListener('mouseup', mouseCallback)
    }
  }

  useEffect(() => {
    const initRive = async () => {
      const riveApp = await RiveApp.init()
      riveAppRef.current = riveApp
      const rive = riveApp.rive
      setRiveInstance(rive)

      const canvas = canvasRef.current
      if (canvas) {
        const { width, height } = canvas.getBoundingClientRect()
        canvas.width = width
        canvas.height = height

        const renderer = rive.makeRenderer(canvas)
        const fetchRiveFileResponse = await fetch(rivFileUrl)
        const bytes = await fetchRiveFileResponse.arrayBuffer()
        const rivFile = await rive.load(new Uint8Array(bytes))
        const artboard = rivFile.artboardByName(artboardName)
        const stateMachine = new rive.StateMachineInstance(
          artboard.stateMachineByName(state),
          artboard
        )

        setArtboard(artboard)
        setStateMachine(stateMachine)

        setRiveRuntime({
          artboard,
          stateMachine
        })

        const cleanupListeners = registerListeners(canvas, rive, artboard, stateMachine)

        riveApp.requestRenderLoop(({ time, deltaTime }) => {
          const elapsedTimeSec = deltaTime / 1000

          const numFiredEvents = stateMachine.reportedEventCount()
          for (let i = 0; i < numFiredEvents; i++) {
            const event = stateMachine.reportedEventAt(i)
            console.log(event.name)
          }

          renderer.clear()
          stateMachine.advance(elapsedTimeSec)
          artboard.advance(elapsedTimeSec)
          renderer.save()
          renderer.align(
            rive.Fit[fit],
            rive.Alignment[alignment],
            { minX: 0, minY: 0, maxX: canvas.width, maxY: canvas.height },
            artboard.bounds
          )
          artboard.draw(renderer)
          renderer.restore()
        })

        return cleanupListeners
      }
    }

    initRive()

    return () => {
      if (riveInstance) {
        riveInstance.cleanup()
      }
    }
  }, [rivFileUrl, state, artboardName, fit, alignment])

  return <canvas className='h-full w-full' ref={canvasRef} />
}

export default RiveComponent

export const ThumbUpRiveComponent: React.FC = () => (
  <RiveComponent
    rivFileUrl="/riv/rive.riv"
    state="thumb_up"
    artboardName="thumb"
  />
)

export const RiveText: React.FC<{ text: string }> = ({ text }) => {
  const [riveRuntime, setRiveRuntime] = useState<RiveRuntime>({})

  useEffect(() => {
    if (riveRuntime) {
      const artboard = riveRuntime.artboard
      const stateMachine = riveRuntime.stateMachine
      if (stateMachine && artboard) {
        const textRun = artboard.textRun('text_run')
        textRun.text = text
        const triggerSetTextAnimation = stateMachine.input(0).asTrigger()
        triggerSetTextAnimation.fire()
      }
    }
  }, [text, riveRuntime])

  return (
    <RiveComponent
      setRiveRuntime={setRiveRuntime}
      rivFileUrl="/riv/rive.riv"
      state="controller"
      artboardName="text"
    />
  )
}

export const RiveEmojiFaceLove: React.FC = () => (
  <RiveComponent
    rivFileUrl="/riv/rive.riv"
    state="controller"
    artboardName="love"
  />
)
