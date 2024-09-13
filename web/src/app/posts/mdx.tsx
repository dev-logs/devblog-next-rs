'use client'

import React from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'
import Image from 'next/image'

const mdxComponents = {
    Image
}

export const MdxContent = (props: any) => {
    const {post} = props || {}
    const MDXContent = useMDXComponent(post.body.code)

    return (
        <div className='font-in prose md:prose-md prose-sm lg:prose-lg
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
    sm:first-letter:text-5xl
    '>
            <MDXContent components={mdxComponents}/>
        </div>
    )
}
