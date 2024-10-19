'use client'

import { DotLottie, FrameEvent } from "@lottiefiles/dotlottie-web"
import { useCallback, useEffect, useRef } from "react"

export function Lottie(props: any) {
  let {
    className = '',
    file = '',
    scripts = []
  } = props || {}

  file = file.includes('http')
    ? file
    : `${process.env.NEXT_PUBLIC_PATH_PREFIX}${file}`

  const canvasRef = useRef<HTMLElement | undefined>()

  const lottieFile = useRef<DotLottie>()

  if (!file) throw new Error('Lottie file must be defined')

  const onFrameChanged = useCallback((event: FrameEvent) => {
  }, []) 

  useEffect(() => {
    if (!file || !canvasRef.current) return

    lottieFile.current = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: canvasRef.current!,
      src: file,
    })

    lottieFile.current.addEventListener('frame', onFrameChanged)

    return () => {
      lottieFile.current?.removeEventListener('frame', onFrameChanged)
    }
  }, [canvasRef.current, file])

  return <div className={`grid overflow-clip w-[110%] -translate-x-[5%]`} style={{gridArea: '1/1'}}>
    <div style={{'gridArea': '1/1', 'pointerEvents': 'none'}}>
      <div className="h-full w-full opacity-20 bg-[linear-gradient(to_right,#0A9396_1px,transparent_2px),linear-gradient(to_bottom,#0A9396_1px,transparent_2px)] bg-[size:6rem_4rem]"></div>
    </div>
    <div className={`h-full w-full ${className} flex flex-col justify-center items-center bg-transparent`} style={{'gridArea': '1/1'}}>
      <canvas ref={canvasRef} className='w-full h-full'/>
    </div>
  </div>
}

