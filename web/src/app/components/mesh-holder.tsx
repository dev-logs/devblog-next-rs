import {useEffect} from "react"
import useVisibility from "../hooks/use-visibility"
import {noop} from "lodash"
import {TOTAL_PAGES} from "../home"

export const MeshHolder = (props: any) => {
    const {
        meshRef = {},
        viewport,
        scrollData
    } = props || {}

    if (!viewport) return <></>

    const [isVisible, holderRef]: any = useVisibility(noop, {
        root: null,
        rootMargin: '0px',
        threshold: 0.9,
    })

    useEffect(() => {
        if (viewport.height < 1) return
        if (!isVisible) return
        if (meshRef.current && holderRef.current) {
            const mesh: any = meshRef.current

            let relativeScrollPos = 0
            relativeScrollPos += scrollData.scroll.current * (TOTAL_PAGES - 1)

            mesh.position.y = -relativeScrollPos * viewport.height
        }
    }, [meshRef.current, holderRef.current, window.innerHeight, viewport, isVisible])

    return <>
        <div ref={holderRef}></div>
    </>
}
