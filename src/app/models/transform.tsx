import * as THREE from 'three'
import noop from 'lodash/noop'
import { useEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import SHADERS from '../glsl';
import gsap from 'gsap'
import useGlitch from '../hooks/use-glitch';

export class TransformGeometryProps {
  geometries: Array<THREE.BufferGeometry> = [];
  selectedIndex: number = 0;
  delay: number = 0;
  normalScale: number = 1;
  glitchTimeout: number = 0;
  duration: number = 0;
  scales: Array<number> = [];
  onComplete: Function = noop;
}

export const TransformGeometry = (props: TransformGeometryProps & any) => {
  let { geometries, selectedIndex, delay, duration, scales, normalScale, glitchTimeout, onComplete } =
    props;

  const map = useTexture("/3d-models/the-scene-1/environment-tokio.jpg");
  map.colorSpace = THREE.SRGBColorSpace;

  const { mesh, material, updateAttributes, saveAnimation } = useMemo(() => {
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: SHADERS.PointerVertexShader,
      fragmentShader: SHADERS.PointerFragmentShader,
      metalness: 0.0,
      roughness: 0.0,
      color: "#BED754",
      wireframe: false,
      silent: true,
      vertexColors: true,
      map,
      uniforms: {
        uTime: { value: 0.0 },
        uNormalScale: { value: normalScale }
      },
    });

    const nonIndexedGeometries = geometries.map((geo: any) => {
      const geometry = geo.toNonIndexed();
      return geometry;
    });

    const maxVertexCount = Math.max(
      ...nonIndexedGeometries.map((geo: any) => geo.attributes.position.count),
    );

    const vertexArrays = nonIndexedGeometries.map((geo: any) => {
      const vertices = geo.attributes.position.array;
      const normals = geo.attributes.normal.array;
      const uvs = geo.attributes.uv
        ? geo.attributes.uv.array
        : new Float32Array((vertices.length / 3) * 2);

      if (geo.attributes.position.count < maxVertexCount) {
        const extendedVertices = new Float32Array(maxVertexCount * 3);
        const extendedNormals = new Float32Array(maxVertexCount * 3);
        const extendedUvs = new Float32Array(maxVertexCount * 2);
        extendedVertices.set(vertices);
        extendedNormals.set(normals);
        extendedUvs.set(uvs);
        return {
          vertices: extendedVertices,
          normals: extendedNormals,
          uvs: extendedUvs,
        };
      }
      return { vertices, normals, uvs };
    });

    const baseGeometry = new THREE.BufferGeometry();
    const basePosition = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );
    basePosition.array.set(vertexArrays[0].vertices);
    const baseNormal = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );
    baseNormal.array.set(vertexArrays[0].normals);
    const baseUv = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      2,
    );
    baseUv.array.set(vertexArrays[0].uvs);

    baseGeometry.setAttribute("position", basePosition);
    baseGeometry.setAttribute("normal", baseNormal);
    baseGeometry.setAttribute("uv", baseUv);

    const aPosition2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );

    const aNormal2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 3),
      3,
    );

    const aUv2 = new THREE.BufferAttribute(
      new Float32Array(maxVertexCount * 2),
      2,
    );

    baseGeometry.setAttribute("aPosition2", aPosition2);
    baseGeometry.setAttribute("aNormal2", aNormal2);
    baseGeometry.setAttribute("aUv2", aUv2);

    const updateAttributes = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return;
      }

      const targetVertices = vertexArrays[index].vertices;
      const targetNormals = vertexArrays[index].normals;
      const targetUvs = vertexArrays[index].uvs;

      aPosition2.array.set(targetVertices);
      aNormal2.array.set(targetNormals);
      aUv2.array.set(targetUvs);
      aPosition2.needsUpdate = true;
      aNormal2.needsUpdate = true;
      aUv2.needsUpdate = true;
    };

    const saveAnimation = (index: number) => {
      if (index < 0 || index >= vertexArrays.length) {
        return;
      }

      const targetVertices = vertexArrays[index].vertices;
      const targetNormals = vertexArrays[index].normals;
      const targetUvs = vertexArrays[index].uvs;

      basePosition.array.set(targetVertices);
      baseNormal.array.set(targetNormals);
      baseUv.array.set(targetUvs);
      basePosition.needsUpdate = true;
      baseNormal.needsUpdate = true;
      baseUv.needsUpdate = true;
      material.uniforms.uTime.value = 0;
    };

    return {
      mesh: new THREE.Mesh(baseGeometry, material),
      material,
      geometry: baseGeometry,
      updateAttributes,
      saveAnimation,
    };
  }, []);

  const glitch = useGlitch(
    glitchTimeout,
    (value) => {
      material.uniforms.uTime.value = value;
    },
    [selectedIndex, updateAttributes, material],
  );

  useEffect(() => {
    const gsapGlitch = { value: 0 };
    updateAttributes(selectedIndex);
    gsap.fromTo(
      gsapGlitch,
      { value: 0 },
      {
        value: 1,
        duration,
        delay,
        ease: "power2.in",
        onUpdate: () => {
          glitch(gsapGlitch.value);
        },
        onComplete: () => {
          saveAnimation(selectedIndex);
          onComplete();
        },
      },
    );
  }, [selectedIndex, material, updateAttributes]);

  return (
    <>
      <primitive
        object={mesh}
        scale={scales[selectedIndex] || 1}
        {...props}
      />
    </>
  );
};
