import { useEffect } from 'react'

const useElementReady = (className: string, callback: (e: any) => void) => {
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
  }, [className, callback])
}

export default useElementReady
