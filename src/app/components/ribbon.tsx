import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from 'three'
import SHADERS from '../glsl'
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { useFrame } from "@react-three/fiber";

export const Ribbon = (props: any) => {
  const ribbonTextMap = useTexture("/images/ribbon.png");
  const [textMaterial, sphereGeometry] = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 8);
    ribbonTextMap.colorSpace = THREE.SRGBColorSpace;

    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: SHADERS.RibbonTextVertexShader,
      fragmentShader: SHADERS.RibbonTextFragmentShader,
      map: ribbonTextMap,
      silent: true,
      transparent: true,
      side: THREE.DoubleSide,
      color: "white",
      uniforms: {
        uTime: { value: 0.0 },
        uStrength: { value: 0.3 },
        uSpeed: { value: 0.5 },
        uTexture: { value: ribbonTextMap },
      },
    });

    return [material, geometry];
  }, []);

  const sphereRef: any = useRef(null);

  useFrame((tick: any) => {
    const clock = tick.clock;
    const elapsedTime = clock.getElapsedTime();

    textMaterial.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh
        material={textMaterial}
        position={[3, 3, -5]}
        ref={sphereRef}
        scale={2}
        geometry={sphereGeometry}
        {...props}
      ></mesh>
    </>
  );
};
