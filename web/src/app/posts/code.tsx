'use client'

import gsap from "gsap"
import { isArray, isObject, isObjectLike, isString } from "lodash"
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react"

const TYPING_SPEED_IN_CHARS_PER_SEC = 128

function toTraverseChildren(element: any) {
  const result: any = []
  let recursive = (element: any) => {
    if (!React.isValidElement(element)) {
      return
    }

    result.push(element)
    React.Children.forEach(element?.props?.children || [], (child: any) => {
      recursive(child)
    })
  }

  result.push(element)
  recursive(element)

  return result 
}

function mapCommentBlock(element: any) {
  const traveredChildren = toTraverseChildren(element)

  let SUPPORTED_COMMENT_PREFIXES = ['// ']
  let elementOwnComment: any = null
  for (let i = 0; i < traveredChildren.length; i++) {
    const child = traveredChildren[i]
    const text: string = child.props?.children && isString(child.props.children) ? child.props.children : ''
    const isComment = SUPPORTED_COMMENT_PREFIXES.some((prefix) => text.trim().startsWith(`${prefix}`))
    if (isComment) {
      child.props.iscomment = 'true'
      if (!elementOwnComment) {
        elementOwnComment = child
      }

      elementOwnComment.props.comment = elementOwnComment.props.comment 
        ? elementOwnComment.props.comment + '\n' + text
        : text
      SUPPORTED_COMMENT_PREFIXES.forEach((prefix) => {
        elementOwnComment.props.comment = elementOwnComment.props.comment.replaceAll(prefix, '')
      })
    }
    else if (text && elementOwnComment) {
      elementOwnComment = null
    }
  }
}

export function BigCodeBlock(props: any) {
  const recursive = (element: any) => {
    if (!React.isValidElement(element)) {
      return null
    }

    let children = element.props.children
    if (children.props) {
      children = [children]
    }

    let newChildren = element.props?.children
    if (isArray(children)) {
      newChildren = React.Children.map(children, (child: any) => {
        if (child?.props?.comment) {
          return <Explain {...child.props} explaination={child.props.comment}/>
        }
        else if (child?.props?.iscomment === 'true') {
          return null
        }

        return recursive(child)
      })
      .filter((it: any) => !!it)
    }

    return React.cloneElement(element, {...(element.props || {}), children: newChildren})
  }

  const element = <div {...props}></div>

  mapCommentBlock(element)
  return <div className="text-xs lg:text-md xl:text-lg">{recursive(element)}</div>
}

function Explain(props: any) {
  const {
    explaination
  } = props || {}

  if (!explaination) throw 'The explaination text must be defined'

  const [explained, updateExplain] = useState(false)
  const [displayText, updateDisplayText] = useState('')

  const onClickExplain = useCallback(() => {
    updateExplain(!explained) 
  }, [explained])


  useEffect(() => {
    if (explained) {
      const typingCount = {value: 0}
      gsap.fromTo(typingCount, {value: 0}, {
        value: explaination.length,
        repeat: 0,
        duration: explaination.length / TYPING_SPEED_IN_CHARS_PER_SEC,
        onUpdate: () => {
          const displayText = explaination.substring(0, typingCount.value)
          const cursor = typingCount.value >= explaination.length
            ? ''
            : `${displayText.length % 5 ? '' : '|'}`

          updateDisplayText(`${displayText} ${cursor}`)
        }
      })
    }
    else {
      updateDisplayText('')
    }
  }, [explained, explaination])

  let spacing = '' 
  for (let i = 0; i < explaination.length; i++) {
    if (!explaination[i].trim()) {
      spacing += explaination[i]
    }
    else break
  }

  return <>
    <span {...props}>
    <span {...props}>{spacing}</span>
    <button onClick={onClickExplain}>
        <div className={`flex flex-row justify-center items-center h-1 ${explained ? 'underline' : 'no-underline'} text-highlight font-bold`}>
          Explain
        </div>
      </button>
      <span className="block text-highlight opacity-80">
        {displayText}
      </span>
    </span>
  </>
}
