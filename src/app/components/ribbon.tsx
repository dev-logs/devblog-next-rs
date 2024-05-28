import { useMemo } from "react"
import * as THREE from 'three'

export const RibbonText = (props: any) => {
  const [material, geometry, debugGeometry] = useMemo(() => {
    const sphereGeometry = new THREE.SphereGeometry(1, 30, 30)

    const numOfCurve = 6
    const curvePoints = []
    for (let i = 0; i < numOfCurve; i++) {
      let theta = i / numOfCurve * Math.PI * 2
      curvePoints.push(
        new THREE.Vector3().setFromSphericalCoords(
          1,
          Math.PI / 2 + (Math.random() - 0.5),
          theta)
      )
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints)
    curve.tension = 1;
    curve.closed = true

    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const material = new THREE.LineBasicMaterial({color: 0xff000})
    return [material, geometry, sphereGeometry]
  }, [])

  return <>
    <mesh geometry={geometry} material={material}/>
  </>
}
