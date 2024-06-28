import {Stars} from "@react-three/drei";
import {useFrame, useLoader} from "@react-three/fiber";
import React, {useEffect, useRef, useState} from "react";

import * as THREE from "three";
import {TextureLoader} from "three";

import EarthCloudsMap from "./textures/8k_earth_clouds.jpg";
import EarthDayMap from "./textures/8k_earth_daymap.jpg";
import EarthNightMap from "./textures/8k_earth_nightmap.jpg";
import EarthSpecularMap from "./textures/8k_earth_specular_map.jpg";
import MoonMap from "./textures/moon.jpg";

export const EarthScene = (props: any) => {
  const [dayMap, nightMap, specularMap, cloudsMap, moonMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNightMap, EarthSpecularMap, EarthCloudsMap, MoonMap],
  );
  const [starsFactor, setStarsFactor] = useState(3);

  const earthRef = useRef<any>();
  const cloudsRef = useRef<any>();
  const sunRef = useRef<any>();
  const moonRef = useRef<any>();
  const starsRef = useRef<any>();

  useFrame(({clock}) => {
    const elapsedTime = clock.getElapsedTime() * 1.3;
    earthRef.current.rotation.y = elapsedTime / 60 + Math.PI;
    cloudsRef.current.rotation.y = elapsedTime / 80;

    sunRef.current.position.x = Math.cos(elapsedTime / 30) * 20;
    sunRef.current.position.z = Math.sin(elapsedTime / 30) * 20;
    sunRef.current.position.y = Math.sin(elapsedTime / -30) * 10;

    moonRef.current.position.x = Math.cos(elapsedTime / 50) * 3;
    moonRef.current.position.z = Math.sin(elapsedTime / 50) * 1;
    moonRef.current.rotation.y = elapsedTime / -30;

    starsRef.current.rotation.y = elapsedTime / 150;
  });

  function Intro() {
    const [vec] = React.useState(() => new THREE.Vector3());
    return useFrame((state) => {
      state.camera.position.lerp(
        vec.set(state.mouse.x * 0.2, state.mouse.y * 0.1, 4),
        0.05,
      );
      state.camera.lookAt(0, 0, 0);
    });
  }

  useEffect(() => {
    if (window.innerWidth < 1200) {
      setStarsFactor(2);
    }
    if (window.innerWidth < 768) {
      setStarsFactor(1);
    }
  }, []);

  // Шейдерний матеріал для денного та нічного освітлення
  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: {value: dayMap},
      nightTexture: {value: nightMap},
      sunDirection: {value: new THREE.Vector3()},
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform vec3 sunDirection;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 lightDir = normalize(sunDirection);
        float dotProduct = dot(vNormal, lightDir);
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);
        gl_FragColor = mix(nightColor, dayColor, max(dotProduct, 0.0));
      }
    `,
  });

  useFrame(() => {
    if (sunRef.current) {
      earthMaterial.uniforms.sunDirection.value = sunRef.current.position
        .clone()
        .normalize();
    }
  });

  return (
    <>
      <Stars
        radius={200}
        depth={0}
        count={10000}
        factor={starsFactor}
        fade={false}
        ref={starsRef}
        speed={0}
      />
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.006, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.4}
          transparent={true}
          depthWrite={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={earthRef}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, -0.2]}
        material={earthMaterial}
      >
        <sphereGeometry args={[1, 50, 50]} />
      </mesh>
      <mesh position={[3, 0, 1]} rotation={[0, 0, 0]} ref={moonRef}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial map={moonMap} />
        <pointLight intensity={0.01} />
      </mesh>
      <mesh position={[0, -5, -20]} ref={sunRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhongMaterial emissive="#fcfc5f" />
        <pointLight intensity={2000} />
      </mesh>
      <Intro />
    </>
  );
};
