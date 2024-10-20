'use client'

import gsap from "gsap"
import React, {useCallback, useEffect, useState} from "react"

const TYPING_SPEED_IN_CHARS_PER_SEC = 128

const AUTO_EXPLAINED_THRESHOLD_IN_LINE = 2

export function Explain(props: any) {
  const {
    explaination = ''
  } = props || {}

  const [explained, updateExplain] = useState(
    explaination.split('\n').length <= AUTO_EXPLAINED_THRESHOLD_IN_LINE)
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
    <button className={`
      bg-highlight
      rounded-full
      inline
      opacity-90
      text-highlight
      bg-opacity-35
      font-bold w-5 h-5
      my-1
      border-2 border-highlight
      ${explained ? 'border-opacity-100' : 'border-opacity-0'}
    `}
      onClick={onClickExplain}>
      i
    </button>
    <span className={`block text-highlight opacity-80 ${explained ? 'visible' : 'hidden'}`}>
      {displayText}
    </span>
    </span>
  </>
}
