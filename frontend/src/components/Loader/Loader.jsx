import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./Preloader.css";

const DEFAULT_CONFIG = {
  flightDuration: 3,
  spinsWhileFlying: 3,
  startScale: 0.01,
  endScale: 3,

  // Fraction of the flight (0-1) after which the circular reveal begins opening.
  revealStartAt: 0.75,

  revealDuration: 1,
  circleRevealMaxRadiusMul: 1.05, // multiplier on half-diagonal so the circle fully covers the screen

  modelTargetSize: 3,
};

const easeInCubic = (t) => t * t * t;
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * <Loader
 *    modelUrl="/models/gltf/bat_icon.glb"
 *    onComplete={() => setShowLoader(false)}
 *    config={{ flightDuration: 5.5 }}
 * />
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

    loaderEl.style.setProperty("--loader-z", "9999");

    /* ---------- three.js setup ---------- */
    renderer = new THREE.WebGLRenderer({ canvas: objCanvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
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

        const box = new THREE.Box3().setFromObject(bat);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        bat.position.sub(center);

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
        const fallback = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1, 2),
          new THREE.MeshStandardMaterial({ color: 0x8888ff, metalness: 0.2, roughness: 0.5 })
        );
        object3D.add(fallback);
        modelReady = true;
      }
    );

    function resize3D() {
      const w = window.innerWidth;
      const h = window.innerHeight;
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

    /* ---------- black overlay canvas setup ---------- */
    let DPR = Math.min(window.devicePixelRatio, 2);

    function resizeTear() {
      DPR = Math.min(window.devicePixelRatio, 2);
      tearCanvas.width = window.innerWidth * DPR;
      tearCanvas.height = window.innerHeight * DPR;
      tearCanvas.style.width = window.innerWidth + "px";
      tearCanvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener("resize", resizeTear);
    resizeTear();

    function fillBlack() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    }

    /** Circular iris that punches a growing hole centered at (cx, cy), revealing what's behind. */
    function drawCircleReveal(cx, cy, radius) {
      fillBlack();
      if (radius <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ---------- master timeline ---------- */
    let flightDone = false;
    let zooming = false;
    let flightElapsed = 0;
    let revealElapsed = 0;
    let lastTime = performance.now();
    let revealCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function updateFlight(dt) {
      if (!modelReady || flightDone) return;

      flightElapsed += dt;
      const t = Math.min(flightElapsed / CONFIG.flightDuration, 1);
      const eased = easeInOutSine(t);

      const bounds = visibleBoundsAtZ(0);
      // Top-left → bottom-right.
      const startX = -bounds.width * 0.52;
      const startY = bounds.height * 0.52;
      const endX = bounds.width * 0.52;
      const endY = -bounds.height * 0.52;

      object3D.position.x = startX + (endX - startX) * eased;
      object3D.position.y = startY + (endY - startY) * eased;

      const flightAngle = Math.atan2(endY - startY, endX - startX);
      const spin = eased * Math.PI * 2 * CONFIG.spinsWhileFlying;

      object3D.rotation.z = flightAngle + Math.PI / 2;
      object3D.rotation.y = spin;
      object3D.rotation.x = Math.sin(t * Math.PI * 4) * 0.08;

      // Grow from corner → peak at center → shrink to far corner.
      const scaleProgress = t <= 0.5 ? t * 2 : (1 - t) * 2;
      const scale =
        CONFIG.startScale + (CONFIG.endScale - CONFIG.startScale) * easeInOutSine(scaleProgress);
      object3D.scale.setScalar(scale);

      const orbitAngle = object3D.rotation.y * 1.3;
      accentLight.position.set(
        object3D.position.x + Math.cos(orbitAngle) * 3,
        object3D.position.y + 1.2,
        object3D.position.z + Math.sin(orbitAngle) * 3
      );

      if (t >= CONFIG.revealStartAt && !zooming) {
        zooming = true;
        // Circular reveal always opens from the exact center of the screen.
        revealCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      }

      if (t >= 1) {
        flightDone = true;
        object3D.visible = false;
      }
    }

    function updateReveal(dt) {
      revealElapsed += dt;
      const t = Math.min(revealElapsed / CONFIG.revealDuration, 1);
      const runT = easeInOutSine(t);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxRadius = (Math.hypot(w, h) / 2) * CONFIG.circleRevealMaxRadiusMul;
      const radius = runT * maxRadius;

      drawCircleReveal(revealCenter.x, revealCenter.y, radius);

      // Fade the loader shell out near the end so nothing lingers once the circle covers the screen.
      loaderEl.style.opacity = String(1 - easeInCubic(Math.max(0, (t - 0.6) / 0.4)));
      const zIndex = Math.max(0, Math.round(9999 * (1 - easeInCubic(t))));
      loaderEl.style.setProperty("--loader-z", String(zIndex));

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

      let revealComplete = false;
      if (zooming) {
        revealComplete = updateReveal(dt);
      } else {
        fillBlack();
      }

      if (object3D.visible) {
        renderer.render(scene, camera);
      } else {
        renderer.clear();
      }

      if (!revealComplete) rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

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
      <canvas ref={objCanvasRef} className="preloader-canvas preloader-canvas--bat" />
      <canvas ref={tearCanvasRef} className="preloader-canvas preloader-canvas--tear" />
    </div>
  );
}