import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MANUAL_SCALE = 0.055;

const SWING_AMPLITUDE = Math.PI / 8;
const SWING_FREQUENCY = 0.8;

const BASE_CONE_LENGTH = 140;
const BASE_CONE_RADIUS = 70;
const CONE_RADIAL_SEGMENTS = 40;

const MANUAL_LENGTH_SCALE = 1;
const MANUAL_WIDTH_SCALE = 0.3;
const SHOW_CONTROLS = false;

function computeLocalBoundingBox(object3d) {
  object3d.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  const localMatrix = new THREE.Matrix4();
  const invRoot = new THREE.Matrix4().copy(object3d.matrixWorld).invert();

  object3d.traverse((child) => {
    if (child.isMesh && child.geometry?.attributes?.position) {
      const posAttr = child.geometry.attributes.position;
      localMatrix.copy(invRoot).multiply(child.matrixWorld);
      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i).applyMatrix4(localMatrix);
        box.expandByPoint(v);
      }
    }
  });

  return box;
}

function getBatBottomCenter(batScene) {
  const box = computeLocalBoundingBox(batScene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return new THREE.Vector3(center.x, box.min.y, center.z);
}

function ConeLight({ length, radius, opacity = 0.2 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(radius, length, CONE_RADIAL_SEGMENTS, 1, true);
    geo.translate(0, -length / 2, 0);
    return geo;
  }, [length, radius]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#ffffff") },
        uOpacity: { value: opacity },
        uLength: { value: length },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vY;
        void main() {
          vY = position.y;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uLength;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vY;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          vec3 normal = normalize(vNormal);

          float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.0);
          float edgeFade = 1.0 - fresnel;

          float t = clamp(-vY / uLength, 0.0, 1.0);
          float lengthFade = pow(1.0 - t, 1.6);

          float alpha = uOpacity * edgeFade * lengthFade;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }, [opacity, length]);

  return <mesh geometry={geometry} material={material} />;
}

function BatWithLight({ lengthScale, widthScale, positionNudge }) {
  const groupRef = useRef();
  const { size, viewport } = useThree();

  const isSmallScreen = size.width < 668;
  const scaleFactor = isSmallScreen ? 0.022 : MANUAL_SCALE;

  const RADIUS_FRACTION_X = 0.28;
  const RADIUS_FRACTION_Y = 0.42;
  const ANGULAR_SPEED = 0.3;

  const ZOOM_START = 0.5;
  const ZOOM_END = 2.5;
  const ZOOM_DURATION = 7;
  const ZOOM_RATE = (ZOOM_END - ZOOM_START) / ZOOM_DURATION;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    const radiusX = viewport.width * RADIUS_FRACTION_X;
    const radiusY = viewport.height * RADIUS_FRACTION_Y;
    const centerY = viewport.height * 0.05;

    const angle = Math.PI - t * ANGULAR_SPEED;

    groupRef.current.rotation.z = Math.sin(t * SWING_FREQUENCY) * SWING_AMPLITUDE;
    groupRef.current.position.x = radiusX * Math.cos(angle);
    groupRef.current.position.y = centerY + radiusY * Math.sin(angle);

    const zoom = Math.min(ZOOM_START + t * ZOOM_RATE, ZOOM_END);
    groupRef.current.scale.set(zoom, zoom, zoom);
  });

  const { scene: batScene } = useGLTF("/models/gltf/bat_icon.glb");
  const batBottomLocal = useMemo(() => getBatBottomCenter(batScene), [batScene]);

  const finalLength = BASE_CONE_LENGTH * scaleFactor * lengthScale;
  const finalRadius = BASE_CONE_RADIUS * scaleFactor * widthScale;

  return (
    <group ref={groupRef}>
      <primitive object={batScene} scale={scaleFactor} rotation={[0, Math.PI / 2, 0]} />
      <group position={[0, 0.03, 0]}>
        <ConeLight length={finalLength} radius={finalRadius} />
      </group>
    </group>
  );
}

function BatSignalScene() {
  const [lengthScale] = useState(MANUAL_LENGTH_SCALE);
  const [widthScale] = useState(MANUAL_WIDTH_SCALE);
  const [positionNudge] = useState([0, 0, 0]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 2, 3]} color="#cfe0ff" intensity={1} distance={10} />
        <Suspense fallback={null}>
          <BatWithLight lengthScale={lengthScale} widthScale={widthScale} positionNudge={positionNudge} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default BatSignalScene;

useGLTF.preload("/models/gltf/bat_icon.glb");


