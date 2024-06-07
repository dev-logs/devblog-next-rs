import { useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef} from "react"
import { TOTAL_PAGES } from "../home"

export const MeshHolder = (props: any) => {
  const {
    meshRef = {},
    viewport,
    scrollData,
    ...rest
  } = props || {}

  if (!viewport) return <></>

  const holderRef: any = useRef(null)
  let top = 0
  if (holderRef.current) {
    top = holderRef.current.getBoundingClientRect().top
    console.log(top)
  }

  useEffect(() => {
    if (viewport.height < 1) return
    if (meshRef.current && holderRef.current) {
      const mesh: any = meshRef.current

      let top = holderRef.current.getBoundingClientRect().top
      let relativeScrollPos = top / window.innerHeight

      mesh.position.y = - relativeScrollPos * viewport.height
    }
  }, [meshRef.current, holderRef.current, window.innerHeight, viewport, top])

  return <>
    <div {...rest} ref={holderRef}></div>
  </>
}
