import {Fragment, useEffect, useMemo, useRef} from 'react'
import Shaders from '../glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {Center, Environment, Stage, TransformControls, useGLTF, useTexture} from '@react-three/drei'
import {Bloom, EffectComposer} from '@react-three/postprocessing'
import {HeightReponsive, Reponsive, reponsiveMatch, WidthReponsive} from './reponsive'
import { useFrame, useThree } from '@react-three/fiber'
import { useThreeDContext } from '../contexts'

interface ElectricalEffectProps {
    position: any,
    scale: any
}

export const ElectricalEffect = (props: ElectricalEffectProps) => {
    const woodTexture = useTexture('/3d-models/bloom/wood.jpg')
    woodTexture.colorSpace = THREE.SRGBColorSpace
    const [geometry, wireGeometry, bulb, filamentMaterial]: any = useMemo(() => {
        const wireGeometry = useGLTF('/3d-models/bloom/bulb.glb')

        const metalMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.15,
          color: 'grey',
        })

        const woodMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.1,
          roughness: 0.7,
          map: woodTexture
        })

        const glassMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.7,
          roughness: 0.15,
          transparent: true,
          opacity: 0.1,
          color: 'grey'
        })

        const glassInnerMaterial = new THREE.MeshStandardMaterial({
          metalness: 0.9,
          roughness: 0.0,
          side: THREE.DoubleSide,
          opacity: 1,
          color: 'black'
        })

        const filamentMaterial = new THREE.MeshStandardMaterial({
          metalness: 1,
          roughness: 0,
          color: 'orange',
          emissive: 'orange',
          side: THREE.DoubleSide,
          emissiveIntensity: 300
        })

        let topGroup: any | undefined

        wireGeometry.scene.traverse((child: any) => {
          child.receiveShadow = true
          child.castShadow = true
          if (child.name.startsWith('metal')) {
            child.material = metalMaterial
            child.castShadow = true
          }
          if(child.name === 'glass_inner') {
           child.material = glassInnerMaterial
          }
          else if (child.name.startsWith('glass')) {
            child.material = glassMaterial
            topGroup = child
            child.castShadow = true
            child.receiveShadow = true
          }
          else if (child.name.startsWith('wood')) {
            child.material = woodMaterial
            child.receiveShadow = true
          }
          else if (child.name === 'filament001') {
            child.material = filamentMaterial
            child.castShadow = true
          }
          else if (child.name === 'rele') {
            child.material = filamentMaterial
          }
          else {
            console.log('found redundant', child)
          }
        })

        const geometry = new THREE.PlaneGeometry(5, 1, 25, 25)
        return [geometry, wireGeometry, topGroup, filamentMaterial]
    }, [])

    const {viewport, camera} = useThree()
    const bulbPosition: THREE.Vector3 = useMemo(() => {
      const bulbElement = document.querySelector('.bulb-position')
      const position = bulbElement?.getBoundingClientRect()

      const newPosition = coordinate2dTo3d(position!, camera)
      return newPosition
    }, [camera])

    const mouseRef: any = useRef({x: 0, y: 0})
    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            mouseRef.current.x = e.x / window.innerWidth - 0.5
            mouseRef.current.y =  (e.y) / window.innerHeight - 0.5
        })
    }, []);

    useFrame((tick) => {
      const clock = tick.clock
      const elapsed = clock.getElapsedTime()
      if (bulb) {
        const mousePos = mouseRef.current
        const mousePosVec3 = new THREE.Vector3(mousePos.x, mousePos.y, 0)
        bulb.rotation.y = elapsed * 0.5
        bulb.rotation.x = Math.sin(elapsed * 1.2) * 0.02
        bulb.rotation.z = Math.cos(elapsed * 1.1) * 0.02

        const targetPos = new THREE.Vector3(bulbPosition.x / (viewport.width), (bulbPosition.y) / (viewport.height), 0)
        let distance = mousePosVec3.distanceTo(targetPos)

        if (distance > 1.25) {
          distance = 2
        }

        filamentMaterial.emissiveIntensity = Math.max(((2 - Math.pow(distance, 2)) * 450), 200)
      }
    })

    return <>
      <EffectComposer enableNormalPass={false} resolutionScale={1}>
        <Bloom intensity={0.1} luminanceThreshold={0.2} mipmapBlur/>
      </EffectComposer>
      <Reponsive>
        {(matches: any) => {
          const match = reponsiveMatch(matches)
          return <Fragment>
            {
              match.is(WidthReponsive.SMALL) &&
                <primitive object={wireGeometry.scene} rotation-y={0.5} position={bulbPosition} scale={7}/>
            }
            {
              match.is(WidthReponsive.MEDIUM) &&
                <primitive object={wireGeometry.scene} rotation-y={1} position={bulbPosition} scale={8.5}/>
            }
            {
              match.is(WidthReponsive.LARGE) &&
              <primitive object={wireGeometry.scene} position={bulbPosition} scale={17}/>
            }
            {
              match.is(WidthReponsive.VERY_LARGE) &&
                <primitive object={wireGeometry.scene} rotation-x={0.15} rotation-z={0.18} position={bulbPosition} scale={19}/>
            }
            {
                match.is(WidthReponsive.XX_LARGE) &&
                  <primitive object={wireGeometry.scene} rotation-x={0.15} rotation-z={0.18} position={bulbPosition} scale={20}/>
            }
          </Fragment>
        }}
      </Reponsive>
    </>
}

function coordinate2dTo3d(coordinate: {x: number, y: number}, camera: any) {
  var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3(); // create once and reuse

  vec.set(
    ( coordinate.x / window.innerWidth ) * 2 - 1,
    - ( coordinate.y / window.innerHeight ) * 2 + 1,
    0.5,
  );

  vec.unproject( camera );

  vec.sub( camera.position ).normalize();

  var distance = - camera.position.z / vec.z;

  pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
  return pos
}


useTexture.preload('/3d-models/bloom/wood.jpg')
useGLTF.preload('/3d-models/bloom/bulb.glb')
