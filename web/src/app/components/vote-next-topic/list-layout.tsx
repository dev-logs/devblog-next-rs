import { allPosts } from ".contentlayer/generated"
import { Post } from "contentlayer/generated"
import { ThreeDCanvas } from "../canvas"
import GLSL from "../../glsl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { useFrame } from "@react-three/fiber"
import { Line, useTexture } from "@react-three/drei"
import gsap from "gsap"
import { EffectComposer, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

export function VoteForNextTopic(props: {}) {
  const unPublishPosts = allPosts.filter((post) => !post.isPublished)
  unPublishPosts.push(...unPublishPosts, ...unPublishPosts)

  if (!unPublishPosts.length) return <></>

  useEffect(() => {
    unPublishPosts.forEach((it, index) => {
        it.title = `${index}`
    })
  }, [unPublishPosts.length])

  const [selectedIndex, updateSelectedIndex] = useState({
    left: unPublishPosts.length - 1,
    selected: 0,
    right: 1
  })

  const postDoms = useMemo(() => {
    return unPublishPosts.map((post, index) => {
      return <VoteForNextTopicItem key={index.toString()} post={post} />
    })
  }, [selectedIndex])

  const onNext = useCallback(() => {
    const newIndex = selectedIndex.selected + 1 > unPublishPosts.length - 1 - 1 ? 0 : selectedIndex.selected + 1
    updateSelectedIndex({
      selected: newIndex ,
      left: newIndex + 1 > unPublishPosts.length - 1 ? 0 : newIndex + 1,
      right: newIndex - 1 < 0 ? unPublishPosts.length - 1 : newIndex - 1
    })
  }, [selectedIndex])

  const onPrev = useCallback(() => {
    const newIndex = selectedIndex.selected - 1 < 0 ? unPublishPosts.length - 1 : selectedIndex.selected - 1
    updateSelectedIndex({
      selected: newIndex ,
      left: newIndex + 1 > unPublishPosts.length - 1 ? 0 : newIndex + 1,
      right: newIndex - 1 < 0 ? unPublishPosts.length - 1 : newIndex - 1
    })
  }, [selectedIndex])

  return (
    <>
      <div className="flex flex-col h-full py-10 px-10 rounded-xl overflow-clip">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-0 h-full w-full z-10 rounded-xl overflow-clip">
            <ThreeDCanvas>
              <Background/>
            </ThreeDCanvas>
          </div>
          <div className="absolute flex flex-col top-0 left-0 h-full w-full z-20 p-10">
            <span className="font-Alfa text-3xl text-white">
              Vote for our next topic
            </span>
            <div className="flex h-[180px] w-[100px]">
              <ThreeDCanvas gl={{alpha: true}} style={{background: 'transparent'}}>
                <AnimatedCircle duration={2} startPoint={[0, 3, 0]}/>
              </ThreeDCanvas>
            </div>
            <div className="flex flex-row gap-10 h-full w-full relative">
              <button onClick={onPrev}>Previous</button>
              {postDoms}
              <button onClick={onNext}>Next</button >
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Background(props: {}) {
  const perlinSampler = useTexture('/images/perlin.png')
  const [material] = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      fragmentShader: GLSL.PerlinBackgroundFragmentShader,
      vertexShader: GLSL.PerlinBackgroundVertexShader,
      transparent: true,
      uniforms: {
        uTime: {value: 0},
        uNoiseSampler: {value: perlinSampler},
        uColor1: {value: new THREE.Color('#E1AFD1')},
        uColor2: {value: new THREE.Color('#AD88C6')},
      }
    })

    return [material]
  }, [])

  useFrame((tick) => {
    const elapsed = tick.clock.getElapsedTime()
    material.uniforms.uTime.value = elapsed
  })

  return (
    <>
      <EffectComposer enableNormalPass={false} resolutionScale={1}>
      <Noise
        opacity={0.7}
        premultiply
        blendFunction={BlendFunction.OVERLAY}/>
      </EffectComposer>
      <mesh material={material} scale-x={40} scale-y={10}>
        <planeGeometry args={[1, 1, 1, 1]}/>
      </mesh>
    </>
  )
}

function AnimatedCircle({ duration, startPoint }: any) {
  const lineRef: any = useRef(null)
  const [points, setPoints] = useState<any>([startPoint])

  const resetRef = useRef(false)
  const progressRef = useRef(0)
  const arrowRef: any = useRef(0)

  const arrowTexture = useTexture("/images/ic_arrow.png");
  arrowTexture.colorSpace = THREE.SRGBColorSpace

  const [arrowMaterial, arrowGeometry] = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      map: arrowTexture,
    })

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    return [material, geometry]
  }, [])

  useEffect(() => {
    gsap.fromTo(
      progressRef,
      { current: 0 },
      {
        current: 2.65,
        duration,
        ease: "power1.in",
        repeat: 10,
        repeatDelay: 1,
        onRepeat: () => {
          resetRef.current = true
        },
      },
    );
  }, [startPoint])

  useFrame((tick) => {
    if (lineRef.current) {
      const radius = 0.8
      const line = lineRef.current
      if (resetRef.current) {
        setPoints([startPoint])
        resetRef.current = false
        return
      }

      const progress = progressRef.current
      const angle = progress * Math.PI * 2
      const moveX = startPoint[0] + progress * 0.8
      const moveY = startPoint[1] + progress * -0.8
      const moveZ = startPoint[2]

      const prevPoint = points[points.length - 1]
      const nextPoint = [
        Math.cos(angle) * radius + moveX,
        Math.sin(angle) * radius + moveY,
        0 + moveZ,
      ]

      const nextVec = new THREE.Vector3(...nextPoint).normalize()
      const prevVec = new THREE.Vector3(...prevPoint).normalize()
      const direction = nextVec.sub(prevVec).normalize()

      if (points[points.length - 1] === startPoint) {
        setPoints([nextPoint])
      }
      else {
        const newPoints = [...points, nextPoint]

        arrowRef.current.position.x = nextPoint[0]
        arrowRef.current.position.y = nextPoint[1]
        arrowRef.current.position.z = nextPoint[2]
        arrowRef.current.rotation.z =
          Math.atan(direction.y / direction.x) * 0.7

        setPoints(newPoints)
      }
    }
  })

  return (
    <>
      <Line points={points} color="white" lineWidth={4} ref={lineRef}/>
      <mesh
        material={arrowMaterial}
        geometry={arrowGeometry}
        scale={0.2}
        ref={arrowRef}
      />
    </>
  )
}

function VoteForNextTopicItem(props: {key: any, post: Post  }) {
  const { post } = props || {}
  const itemRef: any = useRef(null)

  return (
    <>
      <div ref={itemRef} className="relative flex flex-col w-[300px] rounded-2xl overflow-clip h-full">
        <div className="absolute bottom-0 left-0 flex flex-col w-full h-full z-20 bg-black bg-opacity-40 backdrop-blur-2xl justify-between py-5 px-5 items-center">
          <img src={post.publicImage} className="h-[50%] w-full object-cover"/>
          <span className="font-Alfa text-lg text-white text-center">{ post.title }</span>
          <span className="font-roboto font-thin text-sm text-white text-center">{ post.description }</span>
          <button className="bg-black rounded-xl px-5 py-2 text-white font-Alfa text-xl">Vote</button>
        </div>
      </div>
    </>
  )
}
