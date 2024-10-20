import { isArray, isString } from "lodash"
import React from "react"
import { Explain } from "./explaination"

function buildElementId(element: any) {
  let index = 1
  const recursive = (element: any) => {
    if (!React.isValidElement(element)) {
      return element
    }

    let modifiedChildren = element.props?.children || element.children
    if (modifiedChildren.props) {
      modifiedChildren = [modifiedChildren]
    }

    if (isArray(modifiedChildren)) {
      modifiedChildren = React.Children.map(modifiedChildren, recursive)
    }

    return React.cloneElement(element, {children: modifiedChildren, 'data-index': index++})
  }

  return recursive(element)
}

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

  const customPropsMap: any = {}

  let SUPPORTED_COMMENT_PREFIXES = ['// ']
  let rootCommentMap: any = null

  for (let i = 0; i < traveredChildren.length; i++) {
    const child = traveredChildren[i]
    const childIndex = child.props?.['data-index']
    const text: string = child.props?.children && isString(child.props.children) ? child.props.children : ''

    const isComment = SUPPORTED_COMMENT_PREFIXES.some((prefix) => text.trim().startsWith(`${prefix}`))
    customPropsMap[childIndex] = {
      isComment,
      childIndex
    }

    if (isComment) {
      if (!rootCommentMap) {
        rootCommentMap = customPropsMap[childIndex]
      }

      rootCommentMap.comment = rootCommentMap.comment 
        ? rootCommentMap.comment + '\n' + text
        : text

      SUPPORTED_COMMENT_PREFIXES.forEach((prefix) => {
        rootCommentMap.comment = rootCommentMap.comment.replaceAll(prefix, '')
      })
    }
    else if (text && rootCommentMap) {
      rootCommentMap = null
    }
  }

  return customPropsMap
}

export function BigCodeBlock(props: any) {
  const element = buildElementId(<div {...props}></div>)
  const mappedProps = mapCommentBlock(element)

  const recursive = (element: any) => {
    if (!React.isValidElement(element)) {
      return element
    }

    let children = element.props.children
    if (children.props) {
      children = [children]
    }

    let modifiedChildren = element.props?.children
      modifiedChildren = React.Children.map(children, (child: any) => {
        let childIndex = child?.props?.['data-index']
        let customProps = mappedProps[childIndex]
        if (customProps?.comment) {
          return <Explain {...child.props} explaination={customProps.comment}/>
        }
        else if (customProps?.isComment) {
          return null
        }

        return recursive(child)
      })
      .filter((it: any) => !!it)

    return React.cloneElement(element, {children: modifiedChildren})
  }

  return <div className="text-xs lg:text-md xl:text-lg">{recursive(element)}</div>
}

