import React from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'
import ArrowRightSvg from '../../../public/images/arrow-right.svg'
import {BigCodeBlock} from './code'
import {Lottie} from './lottie'

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

function _MdxContent (props: any) {
  const {code} = props || {}
  const MDXContent = useMDXComponent(code)

  return <div className='
    font-in prose md:prose-md prose-sm lg:prose-lg
    prose-blockquote:bg-accent/20
    prose-blockquote:p-2
    prose-blockquote:px-6
    prose-blockquote:border-accent
    font-chakra
    text-foreground
    prose-blockquote:not-italic
    prose-blockquote:rounded-r-lg
    prose-li:marker:text-accent
    dark:prose-invert
    prose-li:text-foreground
    prose-strong:text-foreground
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
  h4: (props: any) => <H4 {...props}/>,
  h3: (props: any) => <H3 {...props}/>,
  code: (props: any) => <CodeBlock {...props}/>,
  'ArrowRight': () => <ArrowRightSvg className="inline h-auto w-6 text-highlight"/>,
  Info: (props: any) => <Info {...props}/>,
}

export const Info = (props: any) => {
  return <>
    <div className='text-blue-400 rounded-md w-[105%] -translate-x-[2.5%]'>
      <div className='px-[2.5%] py-2 gap-2 flex flex-col z-0 text-highlight rounded-md border-blue-200 w-full h-full bg-highlight bg-opacity-20 text-md'>
        <span {...props}></span>
      </div>
    </div>
  </>
}

export const CodeBlock = (props: any) => {
  if (props['data-language']) {
    // Big block
    return <>
      <BigCodeBlock {...props}/>
    </>
  }

  // inline code block
  return <>
    <div className='inline bg-opacity-20 p-1 rounded-sm text-sm font-semibold bg-gray-700'>{props.children}</div>
  </>
}

export const H1 = (props: any) => {
  return <>
    <h2 {...props} className='underline font-bold text-foreground'></h2>
  </>
}

export const H4 = (props: any) => {
  return <>
    <h4 className='text-foreground underline'>
      {props.children}
    </h4>
  </>
}

export const H3 = (props: any) => {
  return <>
    <h3 {...props} className='text-foreground underline'/>
  </>
}

export const MdxContent = (props: any) => {
  return <_MdxContent code={props.post.body.code}/>
}

