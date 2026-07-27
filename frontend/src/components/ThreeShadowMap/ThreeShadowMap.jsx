import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame,useThree  } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Bounds } from "@react-three/drei";

const MANUAL_SCALE = 0.055; // ⚠ adjust after testing

// Both the bat and the light beam are children of the SAME rotating
// group (see BatWithLight below), so they always share this exact swing
// — there's no way for them to drift out of sync, by construction.
const SWING_AMPLITUDE = Math.PI / 8;
const SWING_FREQUENCY = 0.8;

// Cone dimensions before the length/width sliders are applied.
const BASE_CONE_LENGTH = 140;
const BASE_CONE_RADIUS = 70;
const CONE_RADIAL_SEGMENTS = 40;

const MANUAL_LENGTH_SCALE = 1;
const MANUAL_WIDTH_SCALE = 0.3;
const SHOW_CONTROLS = true;
const SHOW_TAIL_MARKER = true; // small black dot at the anchor point — turn off for prod

/**
 * Bounding box of `object3d` in its OWN local frame — built from raw
 * vertex positions relative to the root, not from matrixWorld. This is
 * deliberate: computing this inside useMemo (during React's render
 * phase, before the first r3f frame) means relying on object3d's own
 * matrixWorld being "not yet transformed" is fragile under StrictMode
 * double-invoke, HMR, or a reused cached GLTF scene.
 */
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

// Bottom-center point of the bat, in the bat's own local space.
function getBatBottomCenter(batScene) {
  const box = computeLocalBoundingBox(batScene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return new THREE.Vector3(center.x, box.min.y, center.z);
}

/**
 * Procedural conical light beam. A single open-ended cone (no cap
 * discs), built so its TIP sits at the local origin and the base flares
 * out along -Y. Placing this group's origin at the bat's bottom-center
 * point means the tip — not the base — is what's pinned there, so the
 * beam hangs and swings from its top, same as a lamp on a cord.
 */
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
          vY = position.y; // 0 at tip, -length at base
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

          // Fresnel: ~0 face-on, ~1 at grazing/silhouette angles
          float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.0);
          // We want the SILHOUETTE (high fresnel) to fade OUT, not in
          float edgeFade = 1.0 - fresnel;

          // Fade from tip (t=0) to base (t=1)
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
  const { size } = useThree();

  const isSmallScreen = size.width < 668;
  const groupY = isSmallScreen ? 1.47 : 2.499;

  // scale factor now responsive too
  const scaleFactor = isSmallScreen ? 0.022 : MANUAL_SCALE; // tweak 0.04 to taste

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * SWING_FREQUENCY) * SWING_AMPLITUDE;
    }
  });

  const { scene: batScene } = useGLTF("/models/gltf/bat_icon.glb");
  const batBottomLocal = useMemo(() => getBatBottomCenter(batScene), [batScene]);

  const anchorPosition = [
    batBottomLocal.x * scaleFactor + positionNudge[0],
    batBottomLocal.y * scaleFactor + positionNudge[1],
    batBottomLocal.z * scaleFactor + positionNudge[2],
  ];

  const finalLength = BASE_CONE_LENGTH * scaleFactor * lengthScale;
  const finalRadius = BASE_CONE_RADIUS * scaleFactor * widthScale;

  return (
    <group ref={groupRef} position={[0, groupY, 0]}>
      
      <primitive object={batScene} scale={scaleFactor} rotation={[0,Math.PI/2,0]} />

      <group position={[0, 0.03, 0]}>
        <ConeLight length={finalLength} radius={finalRadius} />
      </group>
    </group>
  );
}

function DevControls({
  lengthScale, setLengthScale,
  widthScale, setWidthScale,
  positionNudge, setPositionNudge,
}) {
  const updateNudge = (i, val) => {
    setPositionNudge((prev) => {
      const next = [...prev];
      next[i] = parseFloat(val);
      return next;
    });
  };
  const labels = ["X", "Y", "Z"];

  return (
    // <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-xs p-3 rounded-lg space-y-3 w-64 font-mono">
    //   <div>
    //     <div className="opacity-70 mb-1">beam length</div>
    //     <div className="flex items-center gap-2">
    //       <input
    //         type="range" min={0.1} max={4} step={0.01}
    //         value={lengthScale}
    //         onChange={(e) => setLengthScale(parseFloat(e.target.value))}
    //         className="flex-1"
    //       />
    //       <span className="w-12 text-right">{lengthScale.toFixed(2)}</span>
    //     </div>
    //   </div>
    //   <div>
    //     <div className="opacity-70 mb-1">beam width</div>
    //     <div className="flex items-center gap-2">
    //       <input
    //         type="range" min={0.1} max={4} step={0.01}
    //         value={widthScale}
    //         onChange={(e) => setWidthScale(parseFloat(e.target.value))}
    //         className="flex-1"
    //       />
    //       <span className="w-12 text-right">{widthScale.toFixed(2)}</span>
    //     </div>
    //   </div>
    //   <div>
    //     <div className="opacity-70 mb-1">beam position (nudge)</div>
    //     {positionNudge.map((val, i) => (
    //       <div key={i} className="flex items-center gap-2">
    //         <span className="w-3">{labels[i]}</span>
    //         <input
    //           type="range" min={-2} max={2} step={0.01}
    //           value={val}
    //           onChange={(e) => updateNudge(i, e.target.value)}
    //           className="flex-1"
    //         />
    //         <span className="w-12 text-right">{val.toFixed(2)}</span>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <></>
  );
}

function BatSignalScene() {
  const [lengthScale, setLengthScale] = useState(MANUAL_LENGTH_SCALE);
  const [widthScale, setWidthScale] = useState(MANUAL_WIDTH_SCALE);
  const [positionNudge, setPositionNudge] = useState([0, 0, 0]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {SHOW_CONTROLS && (
        <DevControls
          lengthScale={lengthScale} setLengthScale={setLengthScale}
          widthScale={widthScale} setWidthScale={setWidthScale}
          positionNudge={positionNudge} setPositionNudge={setPositionNudge}
        />
      )}
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
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

