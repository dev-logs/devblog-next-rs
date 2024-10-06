'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'
import { DotLottie } from '@lottiefiles/dotlottie-web'
import RightArrow from '../../../public/images/arrow-right.svg'

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
  const {
    className = '',
    file
  } = props || {}

  const canvasRef = useRef<HTMLElement | undefined>()

  const lottieFile = useRef<any>()

  if (!file) throw new Error('Lottie file must be defined')

  useEffect(() => {
    if (!file || !canvasRef.current) return

    lottieFile.current = new DotLottie({
      autoPlay: true,
      loop: true,
      canvas: canvasRef.current!,
      src: file
    })
  }, [canvasRef.current, file])

  const onPlayClick = useCallback(() => {
    lottieFile.current?.play()
  }, [lottieFile.current])

  return <>
    <div className={`flex flex-col w-full h-full ${className}`}>
      <canvas ref={canvasRef} className='w-full h-full'/>
      <button onClick={onPlayClick}>Play</button>
    </div>
  </>
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
  'ArrowRight': () => <RightArrow className="inline w-3 h-3"/>
}

export const Code = (props: any) => {
  return <>
    <div className='inline bg-gray-700 bg-opacity-50 p-1 rounded-md'>{props.children}</div>
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

