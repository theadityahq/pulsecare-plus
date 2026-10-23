import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Hospital } from '../types';
import { HOSPITALS } from '../data/mockData';
import { Layers, RotateCcw, ZoomIn, ZoomOut, MapPin, Navigation, Sparkles } from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
  sosActive: boolean;
}

export const SpatialCityCanvas: React.FC<Props> = ({
  selectedHospital,
  onSelectHospital,
  sosActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [is2DMode, setIs2DMode] = useState(false);

  // References for Three.js cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 38, 55));
  const currentCameraPos = useRef(new THREE.Vector3(0, 38, 55));
  const cameraLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const markerObjects = useRef<{ mesh: THREE.Object3D; data: Hospital }[]>([]);

  useEffect(() => {
    if (is2DMode || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene with dark midnight-navy fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a17);
    scene.fog = new THREE.FogExp2(0x060a17, 0.016);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 38, 55);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn("WebGL not supported, falling back to 2D view", e);
      setIs2DMode(true);
      return;
    }

    // Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x0f1c3f, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(25, 60, 40);
    scene.add(dirLight);

    // City Mountain Silhouette in Backdrop
    const mountainGeom = new THREE.ConeGeometry(25, 30, 6);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x091024,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });
    
    const m1 = new THREE.Mesh(mountainGeom, mountainMat);
    m1.position.set(-45, 12, -45);
    scene.add(m1);

    const m2 = new THREE.Mesh(mountainGeom, mountainMat);
    m2.position.set(40, 10, -50);
    m2.scale.set(1.2, 0.9, 1.2);
    scene.add(m2);

    const m3 = new THREE.Mesh(mountainGeom, mountainMat);
    m3.position.set(-15, 8, -55);
    m3.scale.set(0.9, 0.8, 0.9);
    scene.add(m3);

    // City Ground Grid
    const gridHelper = new THREE.GridHelper(120, 60, 0x00f0ff, 0x0e1b38);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Glowing Red Emergency Road Network connecting hospitals
    const roadPoints = [
      new THREE.Vector3(-25, 0.1, 20),
      new THREE.Vector3(-10, 0.1, 8),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(12, 0.1, -15),
      new THREE.Vector3(25, 0.1, 5),
      new THREE.Vector3(30, 0.1, 35)
    ];
    const roadCurve = new THREE.CatmullRomCurve3(roadPoints);
    const tubeGeom = new THREE.TubeGeometry(roadCurve, 64, 0.45, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xff2244,
      transparent: true,
      opacity: 0.85
    });
    const roadMesh = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(roadMesh);

    // Animated Moving Ambulance Light on the road
    const ambulanceGeo = new THREE.BoxGeometry(1.6, 1.2, 2.8);
    const ambulanceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00f0ff, emissiveIntensity: 0.6 });
    const ambulanceMesh = new THREE.Mesh(ambulanceGeo, ambulanceMat);
    scene.add(ambulanceMesh);

    // Ambulance Headlights (Yellow Cones)
    const lightConeGeo = new THREE.ConeGeometry(1.2, 5, 8);
    lightConeGeo.rotateX(Math.PI / 2);
    const lightConeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.45 });
    const headlight = new THREE.Mesh(lightConeGeo, lightConeMat);
    headlight.position.set(0, 0, 3);
    ambulanceMesh.add(headlight);

    // Central City Hospital Main Building
    const cityHospGroup = new THREE.Group();
    cityHospGroup.position.set(0, 0, 0);

    const baseBuildingGeom = new THREE.BoxGeometry(14, 8, 10);
    const baseBuildingMat = new THREE.MeshStandardMaterial({
      color: 0x111c38,
      roughness: 0.4,
      metalness: 0.6
    });
    const mainBuilding = new THREE.Mesh(baseBuildingGeom, baseBuildingMat);
    mainBuilding.position.y = 4;
    cityHospGroup.add(mainBuilding);

    // Central Hospital Illuminated Red Cross Pin
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, 14, 0);

    // Large Red Cross marker
    const crossBar1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 4.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff1e46 })
    );
    const crossBar2 = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 1.4, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff1e46 })
    );
    pinGroup.add(crossBar1);
    pinGroup.add(crossBar2);

    // White Cross Center
    const innerCross1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 3.5, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const innerCross2 = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.8, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    pinGroup.add(innerCross1);
    pinGroup.add(innerCross2);

    cityHospGroup.add(pinGroup);
    scene.add(cityHospGroup);

    // Other City Buildings
    const buildingGroup = new THREE.Group();
    const cityMat = new THREE.MeshStandardMaterial({
      color: 0x0a1329,
      roughness: 0.5,
      metalness: 0.7
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x1e3a6a, transparent: true, opacity: 0.5 });

    const rng = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let seed = 17;
    for (let x = -50; x <= 50; x += 12) {
      for (let z = -50; z <= 50; z += 12) {
        if (Math.abs(x) < 14 && Math.abs(z) < 12) continue;
        const h = 5 + rng(seed++) * 20;
        const w = 5 + rng(seed++) * 3;
        const d = 5 + rng(seed++) * 3;

        const bGeom = new THREE.BoxGeometry(w, h, d);
        const bMesh = new THREE.Mesh(bGeom, cityMat);
        bMesh.position.set(x + (rng(seed++) - 0.5) * 2, h / 2, z + (rng(seed++) - 0.5) * 2);
        buildingGroup.add(bMesh);

        const edges = new THREE.EdgesGeometry(bGeom);
        const line = new THREE.LineSegments(edges, edgeMat);
        bMesh.add(line);
      }
    }
    scene.add(buildingGroup);

    // Hospital Nodes & Markers
    markerObjects.current = [];
    HOSPITALS.forEach((hosp) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(hosp.coordinates.x, 0, hosp.coordinates.z);

      // Light Pillar
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.5, 24, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 12;
      hGroup.add(beam);

      // Node Diamond
      const nodeGeo = new THREE.OctahedronGeometry(1.5, 0);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00a3ff,
        emissiveIntensity: 0.7
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.y = 9;
      hGroup.add(node);

      // Base pulsing ring
      const ringGeo = new THREE.RingGeometry(1.2, 2.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.15;
      hGroup.add(ring);

      scene.add(hGroup);
      markerObjects.current.push({ mesh: node, data: hosp });
    });

    // Raycasting for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targets = markerObjects.current.map(m => m.mesh);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const found = markerObjects.current.find(m => m.mesh === intersects[0].object);
        if (found) {
          onSelectHospital(found.data);
        }
      }
    };

    container.addEventListener('click', handlePointerDown);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Pin & Hospital nodes
      pinGroup.rotation.y += delta * 0.6;
      markerObjects.current.forEach(({ mesh }) => {
        mesh.rotation.y += delta * 1.5;
        mesh.rotation.x += delta * 0.7;
      });

      // Move ambulance smoothly along road
      const t = (time * 0.08) % 1;
      const pos = roadCurve.getPointAt(t);
      const tangent = roadCurve.getTangentAt(t);
      ambulanceMesh.position.copy(pos);
      ambulanceMesh.position.y += 0.6;
      ambulanceMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

      // Smooth Camera Lerp
      currentCameraPos.current.lerp(targetCameraPos.current, 0.04);
      camera.position.copy(currentCameraPos.current);

      cameraLookAt.current.lerp(targetLookAt.current, 0.04);
      camera.lookAt(cameraLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handlePointerDown);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [is2DMode]);

  // Adjust camera to focus on selected hospital
  useEffect(() => {
    if (!selectedHospital) {
      targetCameraPos.current.set(0, 38, 55);
      targetLookAt.current.set(0, 2, 0);
    } else {
      const hx = selectedHospital.coordinates.x;
      const hz = selectedHospital.coordinates.z;
      targetCameraPos.current.set(hx + 10, 22, hz + 22);
      targetLookAt.current.set(hx, 6, hz);
    }
  }, [selectedHospital]);

  const resetCamera = () => {
    targetCameraPos.current.set(0, 38, 55);
    targetLookAt.current.set(0, 2, 0);
  };

  const zoomCamera = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.8 : 1.25;
    targetCameraPos.current.multiplyScalar(factor);
    targetCameraPos.current.y = Math.max(12, Math.min(80, targetCameraPos.current.y));
  };

  return (
    <div className="relative w-full h-[360px] md:h-[420px] lg:h-[450px] rounded-3xl overflow-hidden glass-panel border border-cyan-500/25 shadow-2xl">
      {/* 3D Canvas */}
      {!is2DMode ? (
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* 2D Fallback */
        <div className="w-full h-full bg-[#070B19] p-6 relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="relative w-full max-w-md aspect-square border border-cyan-500/30 rounded-full flex items-center justify-center">
            <div className="absolute inset-8 border border-cyan-500/20 rounded-full" />
            <div className="absolute w-full h-[1px] bg-cyan-500/20" />
            <div className="absolute h-full w-[1px] bg-cyan-500/20" />

            <div className="absolute flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#00F0FF] animate-ping opacity-75" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-900" />
              <span className="text-[10px] text-cyan-300 font-mono mt-4 font-bold bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                YOU (GPS 12m)
              </span>
            </div>

            {HOSPITALS.map((h) => {
              const leftPercent = 50 + (h.coordinates.x / 60) * 40;
              const topPercent = 50 + (h.coordinates.z / 60) * 40;
              const isSelected = selectedHospital?.id === h.id;

              return (
                <button
                  key={h.id}
                  onClick={() => onSelectHospital(h)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 scale-125 z-20 shadow-[0_0_15px_#00F0FF]'
                      : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/40 hover:scale-110 z-10'
                  }`}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating 3D City Overlay Badges (Matching Screenshot) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center space-x-2 border-cyan-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-cyan-200 font-mono">3D CITY TELEMETRY</span>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setIs2DMode(!is2DMode)}
            className="glass-panel px-2.5 py-1.5 rounded-xl text-xs text-cyan-300 hover:text-white transition-all flex items-center space-x-1.5 border border-cyan-500/20"
            title="Toggle 2D / 3D Mode"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">{is2DMode ? '3D View' : '2D Radar'}</span>
          </button>
          {!is2DMode && (
            <>
              <button
                onClick={() => zoomCamera('in')}
                className="glass-panel p-1.5 rounded-xl text-cyan-300 hover:text-white transition-all border border-cyan-500/20"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => zoomCamera('out')}
                className="glass-panel p-1.5 rounded-xl text-cyan-300 hover:text-white transition-all border border-cyan-500/20"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetCamera}
                className="glass-panel p-1.5 rounded-xl text-cyan-300 hover:text-white transition-all border border-cyan-500/20"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Hospital Node Pins directly over canvas (As in Screenshot) */}
      <div className="absolute inset-x-4 bottom-4 pointer-events-none flex flex-wrap items-center justify-center gap-2">
        <div
          onClick={() => onSelectHospital(HOSPITALS[0])}
          className="pointer-events-auto cursor-pointer glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[11px] text-white hover:scale-105 transition-all shadow-lg flex items-center space-x-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold">City Hospital</span>
          <span className="text-slate-400 font-mono text-[10px]">Main Center</span>
        </div>

        <div
          onClick={() => onSelectHospital(HOSPITALS[1])}
          className="pointer-events-auto cursor-pointer glass-panel px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-200 hover:border-cyan-400 hover:scale-105 transition-all shadow-lg flex items-center space-x-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="font-bold">St. Mary's Hospital</span>
          <span className="text-cyan-300 font-mono text-[10px]">2.4 km • 6 mins</span>
        </div>

        <div
          onClick={() => onSelectHospital(HOSPITALS[2])}
          className="pointer-events-auto cursor-pointer glass-panel px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-200 hover:border-cyan-400 hover:scale-105 transition-all shadow-lg flex items-center space-x-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-bold">CarePlus Clinic</span>
          <span className="text-emerald-300 font-mono text-[10px]">1.1 km • 3 mins</span>
        </div>
      </div>
    </div>
  );
};
