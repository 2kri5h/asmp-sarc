import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./Preloader.css";

const DEFAULT_CONFIG = {
  flightDuration: 5,
  spinsWhileFlying: 3,
  startScale: 0.5,
  endScale: 5,

  // Tear now grows between these two points of the flight's progress
  // (0 = start of flight, 1 = end of flight), independent of when the
  // bat itself finishes flying.
  tearStartAt: 0.25,
  tearFullAt: 0.75,
  tearDiagStart: 0.25,
  tearDiagEnd: 0.75,
  tearRoughness: 24,

  swallowDuration: 1.8,

  // Model-specific: the target "unit size" the bat is normalized to
  // before startScale/endScale are applied on top of it.
  modelTargetSize: 2,
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCrackPolygon(x0, y0, x1, y1, width, roughness, seed) {
  const segments = 14;
  const dx = x1 - x0,
    dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len,
    ny = dx / len;
  const rand = mulberry32(seed);

  const top = [],
    bottom = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const px = x0 + dx * t;
    const py = y0 + dy * t;
    const taper = Math.sin(Math.PI * t);
    const jitter = (rand() - 0.5) * roughness * taper;
    const halfW = (width / 2) * taper + 1;
    top.push([px + nx * halfW + nx * jitter, py + ny * halfW + ny * jitter]);
    bottom.push([px - nx * halfW + nx * jitter, py - ny * halfW + ny * jitter]);
  }
  return top.concat(bottom.reverse());
}

/**
 * <Loader
 *    modelUrl="/models/gltf/bat_icon.glb"
 *    onComplete={() => setShowLoader(false)}
 *    config={{ flightDuration: 5.5 }}   // optional overrides
 * />
 *
 * Renders the tear-reveal loader. Calls onComplete() once the
 * zoom/swallow animation finishes, at which point the parent should
 * hide/unmount this component (it also self-hides via display:none).
 */
export default function Loader({ modelUrl = "/models/gltf/bat_icon.glb", onComplete, config = {} }) {
  const CONFIG = { ...DEFAULT_CONFIG, ...config };

  const loaderRef = useRef(null);
  const tearCanvasRef = useRef(null);
  const objCanvasRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, object3D, accentLight;
    let rafId;
    let disposed = false;

    const loaderEl = loaderRef.current;
    const tearCanvas = tearCanvasRef.current;
    const objCanvas = objCanvasRef.current;
    const ctx = tearCanvas.getContext("2d");

    /* ---------- three.js setup ---------- */
    renderer = new THREE.WebGLRenderer({ canvas: objCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 0.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, 1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(-2, 3, -6);
    scene.add(rimLight);

    accentLight = new THREE.PointLight(0xffffff, 3.5, 12, 2);
    accentLight.position.set(0, 1, 4);
    scene.add(accentLight);

    // Group wraps the loaded model so we can rotate/scale/position it
    // as one unit regardless of the model's own internal pivot/origin.
    object3D = new THREE.Group();
    object3D.scale.setScalar(CONFIG.startScale);
    scene.add(object3D);

    /* ---------- load the bat model ---------- */
    let modelReady = false;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelUrl,
      (gltf) => {
        const bat = gltf.scene;

        // Normalize: center the bat on its own bounding-box center,
        // then scale it so its largest dimension == modelTargetSize.
        const box = new THREE.Box3().setFromObject(bat);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        bat.position.sub(center); // recenter to origin

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const normalizeScale = CONFIG.modelTargetSize / maxDim;
        bat.scale.setScalar(normalizeScale);

        bat.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        object3D.add(bat);
        modelReady = true;
      },
      undefined,
      (err) => {
        console.error("Loader: failed to load model", modelUrl, err);
        // Fall back to a simple placeholder so the animation doesn't hang.
        const fallback = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1, 2),
          new THREE.MeshStandardMaterial({ color: 0x8888ff, metalness: 0.2, roughness: 0.5 })
        );
        object3D.add(fallback);
        modelReady = true;
      }
    );

    function resize3D() {
      const w = window.innerWidth,
        h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize3D);
    resize3D();

    function visibleBoundsAtZ(z) {
      const dist = camera.position.z - z;
      const vFov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * dist;
      const width = height * camera.aspect;
      return { width, height };
    }

    /* ---------- tear canvas setup ---------- */
    let DPR = Math.min(window.devicePixelRatio, 2);
    let tearP1 = { x: 0, y: 0 };
    let tearP2 = { x: 0, y: 0 };

    function computeDiagonalPoints() {
      const w = window.innerWidth,
        h = window.innerHeight;
      tearP1 = { x: w * CONFIG.tearDiagStart, y: h * CONFIG.tearDiagStart };
      tearP2 = { x: w * CONFIG.tearDiagEnd, y: h * CONFIG.tearDiagEnd };
    }

    function resizeTear() {
      DPR = Math.min(window.devicePixelRatio, 2);
      tearCanvas.width = window.innerWidth * DPR;
      tearCanvas.height = window.innerHeight * DPR;
      tearCanvas.style.width = window.innerWidth + "px";
      tearCanvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      computeDiagonalPoints();
    }
    window.addEventListener("resize", resizeTear);
    computeDiagonalPoints();
    resizeTear();

    function drawBlackWithTear(crackPoints, swallowT, swallowOrigin) {
      const w = window.innerWidth,
        h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";

      if (crackPoints && crackPoints.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(crackPoints[0][0], crackPoints[0][1]);
        for (let i = 1; i < crackPoints.length; i++) ctx.lineTo(crackPoints[i][0], crackPoints[i][1]);
        ctx.closePath();
        ctx.fill();
      }

      if (swallowT > 0 && swallowOrigin) {
        const cx = swallowOrigin.x,
          cy = swallowOrigin.y;
        const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.15;
        const r = maxR * easeInOutSine(swallowT);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    /* ---------- master timeline ---------- */
    // Flight and zoom now run as independent flags rather than a single
    // sequential "phase" string, so the zoom/reveal can begin the moment
    // the tear finishes (tearFullAt) even if the bat is still flying.
    let flightDone = false;
    let zooming = false;
    let flightElapsed = 0;
    let swallowElapsed = 0;
    let lastTime = performance.now();
    let currentCrack = null;
    let tearTipPoint = { x: tearP1.x, y: tearP1.y };

    function growTear(tearT) {
      const eased = easeOutCubic(Math.min(tearT, 1));
      tearTipPoint = {
        x: tearP1.x + (tearP2.x - tearP1.x) * eased,
        y: tearP1.y + (tearP2.y - tearP1.y) * eased,
      };
      const width = 6 + eased * 34;
      currentCrack = buildCrackPolygon(tearP1.x, tearP1.y, tearTipPoint.x, tearTipPoint.y, width, CONFIG.tearRoughness, 42);

      loaderEl.style.setProperty("--tear-x", tearTipPoint.x + "px");
      loaderEl.style.setProperty("--tear-y", tearTipPoint.y + "px");
    }

    function updateFlight(dt) {
      // Wait for the model to finish loading before starting the flight
      // so the bat doesn't pop in mid-animation.
      if (!modelReady || flightDone) return;

      flightElapsed += dt;
      const t = Math.min(flightElapsed / CONFIG.flightDuration, 1);
      const eased = easeOutCubic(t);

      const bounds = visibleBoundsAtZ(0);
      const startX = -bounds.width * 0.65;
      const startY = bounds.height * 0.55;
      const endX = bounds.width * 0.55;
      const endY = -bounds.height * 0.45;

      object3D.position.x = startX + (endX - startX) * eased;
      object3D.position.y = startY + (endY - startY) * eased;
      object3D.rotation.y = eased * Math.PI * 2 * CONFIG.spinsWhileFlying;
      object3D.rotation.z = Math.sin(t * Math.PI * 6) * 0.15;
      const scale = CONFIG.startScale + (CONFIG.endScale - CONFIG.startScale) * easeInCubic(t);
      object3D.scale.setScalar(scale);

      const orbitAngle = object3D.rotation.y * 1.3;
      accentLight.position.set(
        object3D.position.x + Math.cos(orbitAngle) * 3,
        object3D.position.y + 1.2,
        object3D.position.z + Math.sin(orbitAngle) * 3
      );

      // Tear grows only between tearStartAt and tearFullAt of the flight's
      // progress — e.g. 1/4 to 3/4 of the way through the flight.
      if (t >= CONFIG.tearStartAt) {
        const tearT = Math.min(
          (t - CONFIG.tearStartAt) / (CONFIG.tearFullAt - CONFIG.tearStartAt),
          1
        );
        growTear(tearT);

        // The instant the tear finishes growing, kick off the zoom/reveal —
        // don't wait for the bat's flight to finish too.
        if (tearT >= 1 && !zooming) {
          zooming = true;
        }
      }

      if (t >= 1) flightDone = true;
    }

    function updateZoom(dt) {
      swallowElapsed += dt;
      const t = Math.min(swallowElapsed / CONFIG.swallowDuration, 1);
      const swallowT = easeInOutSine(t);

      const scale = 1 + swallowT * 1.6;
      loaderEl.style.transform = `scale(${scale})`;
      loaderEl.style.opacity = String(1 - Math.max(0, (t - 0.55) / 0.45));

      drawBlackWithTear(currentCrack, swallowT, tearTipPoint);

      // Keep the bat spinning/growing a little through the zoom for continuity.
      object3D.rotation.y += dt * 4;
      object3D.scale.multiplyScalar(1 + dt * 0.6);

      if (t >= 1) {
        loaderEl.style.display = "none";
        if (onComplete) onComplete();
      }
      return t >= 1;
    }

    function animate(now) {
      if (disposed) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!flightDone) updateFlight(dt);

      let zoomComplete = false;
      if (zooming) {
        zoomComplete = updateZoom(dt);
      } else {
        drawBlackWithTear(currentCrack, 0, null);
      }

      renderer.render(scene, camera);
      if (!zoomComplete) rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    /* ---------- cleanup on unmount ---------- */
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize3D);
      window.removeEventListener("resize", resizeTear);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  return (
    <div id="loader" ref={loaderRef} className="preloader">
      <canvas ref={tearCanvasRef} className="preloader-canvas" />
      <canvas ref={objCanvasRef} className="preloader-canvas" />
    </div>
  );
}
