'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'
import { DotLottie, FrameEvent } from '@lottiefiles/dotlottie-web'
import ArrowRightSvg from '../../../public/images/arrow-right.svg'

function CustomImage(props: any) {
  const src = props.src.includes('http')
    ? props.src
    : `${process.env.NEXT_PUBLIC_PATH_PREFIX}${props.src}`

  return <>
    <img {...props} src={src}/>
  </> 
}

function L2(props: any) {
  return <div className='grid grid-cols-2 w-full items-center lg:gap-2 gap-1 justify-between'>
    <div className="col-span-1 flex justify-end">
      {props.children[0]}
    </div>
    <div className="col-span-1 flex justify-between">
      {props.children[1]}
    </div>
  </div> 
}

function Lottie(props: any) {
  let {
    className = '',
    file = '',
    scripts = []
  } = props || {}

  file = file.includes('http')
    ? file
    : `${process.env.NEXT_PUBLIC_PATH_PREFIX}${file}`

  const canvasRef = useRef<HtmlElement | undefined>()

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

  return <div className={`grid overflow-clip`} style={{gridArea: '1/1'}}>
    <div style={{'gridArea': '1/1', 'pointerEvents': 'none'}}>
      <div className="h-full w-full opacity-20 bg-[linear-gradient(to_right,#0A9396_1px,transparent_2px),linear-gradient(to_bottom,#0A9396_1px,transparent_2px)] bg-[size:6rem_4rem]"></div>
    </div>
    <div className={`h-full w-full ${className} flex flex-col justify-center items-center bg-transparent`} style={{'gridArea': '1/1'}}>
      <canvas ref={canvasRef} className='w-full h-full'/>
    </div>
  </div>
}

function _MdxContent (props: any) {
  const {code} = props || {}
  const MDXContent = useMDXComponent(code)

  return <div className='
    font-in prose md:prose-md prose-sm lg:prose-lg
    prose-blockquote:bg-accent/20
    prose-blockquote:p-2
    prose-blockquote:px-6
    prose-blockquote:border-accent
    font-roboto
    font-light
    prose-blockquote:not-italic
    prose-blockquote:rounded-r-lg

    prose-li:marker:text-accent

    dark:prose-invert
    dark:prose-blockquote:border-accentDark
    dark:prose-blockquote:bg-accentDark/20
    dark:prose-li:marker:text-accentDark

    first-letter:text-3xl
    sm:first-letter:text-5xl'>
    <MDXContent components={mdxComponents}/>
  </div>
}

const mdxComponents = {
  img: (props: any) => <CustomImage {...props}></CustomImage>,
  L2: (props: any) => <L2 {...props}/>,
  Mdx: (props: any) => <_MdxContent code={props.children}/>,
  Lottie: (props:any) => <Lottie {...props}/>,
  h1: (props: any) => <H1 {...props}/>,
  code: (props: any) => <Code {...props}/>,
  'ArrowRight': () => <ArrowRightSvg className="inline h-auto w-6 text-blue-500"/>,
  Info: (props: any) => <Info {...props}/>
}

export const Info = (props: any) => {
  return <>
    <div className='overflow-hidden relative text-blue-400 rounded-md h-20 w-full'>
      <div className='absolute pl-8 z-0 text-blue-400 rounded-md border border-blue-400 w-full h-full'>
        <span {...props}></span>
      </div>
      <div className='absolute -top-5 z-10 -left-5 w-10 h-10 bg-black border-b text-white border-r border-blue-400 rounded-full justify-end'>
        i 
      </div>
    </div>
  </>
}

export const Code = (props: any) => {
  return <>
    <div className='inline bg-opacity-50 p-1 rounded-sm text-sm font-semibold bg-gray-900'>{props.children}</div>
  </>
}

export const H1 = (props: any) => {
  return <>
    <h2 {...props} className='text-blue-500'></h2>
  </>
}


export const MdxContent = (props: any) => {
  return <_MdxContent code={props.post.body.code}/>
}

