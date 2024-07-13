import { useEffect, useState } from 'react'

const useElementReady = (className: string, callback: (e: any) => void) => {
  const [windowSize, updateWindowSize] = useState<any>(null)

  useEffect(() => {
    const checkElement = () => {
      const element = document.querySelector(`.${className}`)
      if (element) {
        callback(element)
        return true
      }

      return false
    }

    if (checkElement()) return

    const observer = new MutationObserver(() => {
      if (checkElement()) {
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [className, callback, windowSize])

  useEffect(() => {
    const listener = () => {
      updateWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [])
}

export default useElementReady
