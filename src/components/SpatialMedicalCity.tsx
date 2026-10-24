import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Hospital } from '../types';
import { HOSPITALS } from '../data/mockData';
import { Layers, RotateCcw, ZoomIn, ZoomOut, MapPin, Navigation, Info, ShieldAlert, Crosshair, Building2 } from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
  sosActive: boolean;
}

export const SpatialMedicalCity: React.FC<Props> = ({
  selectedHospital,
  onSelectHospital,
  sosActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [is2DMode, setIs2DMode] = useState(false);
  const [hoveredHosp, setHoveredHosp] = useState<Hospital | null>(null);

  // References for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Camera animation targets
  const targetCameraPos = useRef(new THREE.Vector3(0, 36, 52));
  const currentCameraPos = useRef(new THREE.Vector3(0, 36, 52));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Markers map for raycasting / selection
  const markerMeshes = useRef<{ mesh: THREE.Mesh; hosp: Hospital }[]>([]);

  useEffect(() => {
    if (is2DMode || !containerRef.current) return;

    let destroyed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let observer: IntersectionObserver | null = null;
    let handleResize: (() => void) | null = null;
    let handlePointerMove: ((e: MouseEvent) => void) | null = null;
    let handleClick: ((e: MouseEvent) => void) | null = null;
    let startTimer: any = null;

    const initTimer = setTimeout(() => {
      if (destroyed || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 460;

    // 1. Scene setup with Future Clinic Warm Ivory / Champagne Atmosphere
    const currentScene = new THREE.Scene();
    scene = currentScene;
    currentScene.background = new THREE.Color(0xF1F0E9);
    currentScene.fog = new THREE.FogExp2(0xF1F0E9, 0.012);
    sceneRef.current = currentScene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 800);
    camera.position.copy(currentCameraPos.current);
    camera.lookAt(currentLookAt.current);
    cameraRef.current = camera;

    // 3. Renderer with power-efficiency & pixel ratio cap
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        precision: 'mediump'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1.0);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn("WebGL not available, defaulting to 2D view", e);
      setIs2DMode(true);
      return;
    }

    // 4. Lighting: Warm Architectural Natural Sunlight + Champagne Ambient
    const ambientLight = new THREE.AmbientLight(0xFFFBF2, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFDF8EE, 1.8);
    sunLight.position.set(40, 65, 35);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xC4A66B, 0.6);
    fillLight.position.set(-30, 20, -30);
    scene.add(fillLight);

    // 5. Ground Canvas & Grid in Future Clinic Champagne
    const groundGeom = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xE8E6DC,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(120, 40, 0xC4A66B, 0xDDD8CA);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 6. Medical Transit Network (Inter-Hospital Emergency Arteries)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x173E35, roughness: 0.6 });
    const lineMat = new THREE.LineDashedMaterial({ color: 0xC4A66B, dashSize: 1.5, gapSize: 1, linewidth: 2 });

    // Main Avenue (East-West & North-South)
    const avenue1 = new THREE.Mesh(new THREE.PlaneGeometry(120, 4.5), roadMat);
    avenue1.rotation.x = -Math.PI / 2;
    avenue1.position.set(0, 0.02, 0);
    scene.add(avenue1);

    const avenue2 = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 120), roadMat);
    avenue2.rotation.x = -Math.PI / 2;
    avenue2.position.set(0, 0.02, 0);
    scene.add(avenue2);

    // Diagonal emergency arterial routes
    const diagRoad = new THREE.Mesh(new THREE.PlaneGeometry(75, 3), roadMat);
    diagRoad.rotation.x = -Math.PI / 2;
    diagRoad.rotation.z = Math.PI / 4;
    diagRoad.position.set(-10, 0.02, -10);
    scene.add(diagRoad);

    // 7. Rich Architectural City Buildings
    const buildingMatDeep = new THREE.MeshStandardMaterial({ color: 0x173E35, roughness: 0.4, metalness: 0.2 });
    const buildingMatIvory = new THREE.MeshStandardMaterial({ color: 0xFAF8F3, roughness: 0.3, metalness: 0.1 });
    const buildingMatChampagne = new THREE.MeshStandardMaterial({ color: 0xD6B77C, roughness: 0.5, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xC4A66B, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.75 });

    // Procedural city blocks surrounding the medical hubs
    const cityGroup = new THREE.Group();
    const buildingSeeds = [
      // Left sector (Clinics & Research Labs)
      { x: -28, z: -15, w: 9, h: 14, d: 8, mat: buildingMatDeep },
      { x: -38, z: -25, w: 10, h: 22, d: 9, mat: buildingMatIvory },
      { x: -25, z: -30, w: 7, h: 16, d: 7, mat: buildingMatChampagne },
      { x: -36, z: 12, w: 11, h: 18, d: 8, mat: buildingMatIvory },
      { x: -22, z: 24, w: 8, h: 12, d: 8, mat: buildingMatDeep },

      // Right sector (Hospital Towers & Care Pavilions)
      { x: 26, z: -18, w: 10, h: 20, d: 8, mat: buildingMatIvory },
      { x: 38, z: -26, w: 8, h: 26, d: 9, mat: buildingMatDeep },
      { x: 24, z: -34, w: 9, h: 15, d: 7, mat: buildingMatChampagne },
      { x: 34, z: 16, w: 12, h: 16, d: 10, mat: buildingMatIvory },
      { x: 22, z: 28, w: 8, h: 13, d: 8, mat: buildingMatDeep },

      // North sector (Trauma & Logistics Center)
      { x: -10, z: -35, w: 12, h: 19, d: 10, mat: buildingMatDeep },
      { x: 12, z: -36, w: 11, h: 23, d: 9, mat: buildingMatIvory },

      // South sector (Community Health & Wellness)
      { x: -14, z: 32, w: 9, h: 11, d: 8, mat: buildingMatIvory },
      { x: 14, z: 30, w: 10, h: 15, d: 9, mat: buildingMatChampagne },
    ];

    buildingSeeds.forEach(b => {
      const bGeom = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mesh = new THREE.Mesh(bGeom, b.mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      cityGroup.add(mesh);

      // Add architectural glass bands
      const glassBandGeom = new THREE.BoxGeometry(b.w + 0.1, 1.2, b.d + 0.1);
      for (let y = 3; y < b.h - 2; y += 3.5) {
        const glassMesh = new THREE.Mesh(glassBandGeom, glassMat);
        glassMesh.position.set(b.x, y, b.z);
        cityGroup.add(glassMesh);
      }

      // Add roof architectural elements
      const roofGeom = new THREE.BoxGeometry(b.w * 0.7, 1.5, b.d * 0.7);
      const roofMesh = new THREE.Mesh(roofGeom, buildingMatDeep);
      roofMesh.position.set(b.x, b.h + 0.75, b.z);
      cityGroup.add(roofMesh);
    });

    scene.add(cityGroup);

    // 8. Central AIIMS Trauma Center Complex & Helipad
    const centerComplex = new THREE.Group();
    centerComplex.position.set(0, 0, -8);

    // Main Trauma Base
    const baseBuilding = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 14), buildingMatDeep);
    baseBuilding.position.y = 6;
    centerComplex.add(baseBuilding);

    // Elevated ICU Tower
    const icuTower = new THREE.Mesh(new THREE.BoxGeometry(10, 18, 9), buildingMatIvory);
    icuTower.position.set(0, 15, 0);
    centerComplex.add(icuTower);

    // Rooftop Helipad
    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.4, 24), buildingMatChampagne);
    helipad.position.set(0, 24.2, 0);
    centerComplex.add(helipad);

    // Vermilion Emergency Cross on Helipad
    const crossBar1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.5, 1.4), new THREE.MeshBasicMaterial({ color: 0xD44A3C }));
    crossBar1.position.set(0, 24.4, 0);
    centerComplex.add(crossBar1);
    const crossBar2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 5.5), new THREE.MeshBasicMaterial({ color: 0xD44A3C }));
    crossBar2.position.set(0, 24.4, 0);
    centerComplex.add(crossBar2);

    scene.add(centerComplex);

    // 9. Floating Medical Pins for Hospitals with Future Clinic Styling
    markerMeshes.current = [];
    const hospitalPositions: [number, number, number][] = [
      [0, 28, -8],    // AIIMS Apex Trauma
      [-28, 20, -15], // Safdarjung Hospital
      [26, 25, -18],  // Max Super Speciality
      [34, 22, 16]    // Indraprastha Apollo
    ];

    HOSPITALS.slice(0, 4).forEach((hosp, idx) => {
      const pos = hospitalPositions[idx];
      const pinGroup = new THREE.Group();
      pinGroup.position.set(pos[0], pos[1], pos[2]);

      // Outer pulsing ring
      const ringGeom = new THREE.RingGeometry(1.6, 2.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hosp.category === 'Trauma Center Level 1' ? 0xD44A3C : 0xC4A66B,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      pinGroup.add(ring);

      // Core Marker Sphere
      const sphereGeom = new THREE.SphereGeometry(1.2, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: hosp.category === 'Trauma Center Level 1' ? 0xD44A3C : 0x173E35,
        roughness: 0.2,
        metalness: 0.5
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.y = 1.2;
      pinGroup.add(sphere);

      // Stem line connecting to building
      const stemGeom = new THREE.CylinderGeometry(0.12, 0.12, 6, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xC4A66B });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.y = -2;
      pinGroup.add(stem);

      currentScene.add(pinGroup);
      markerMeshes.current.push({ mesh: sphere, hosp });
    });

    // 10. Moving Rapid Response Ambulances (Visual Telemetry)
    const ambulanceGroup = new THREE.Group();
    const amb1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 3.2), buildingMatIvory);
    const sirenLight = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xD44A3C }));
    sirenLight.position.y = 0.8;
    amb1.add(sirenLight);
    amb1.position.set(0, 0.6, 15);
    ambulanceGroup.add(amb1);
    scene.add(ambulanceGroup);

    // 11. Interactive Raycasting & Click Handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes.current.map(m => m.mesh));
      if (intersects.length > 0) {
        const found = markerMeshes.current.find(m => m.mesh === intersects[0].object);
        if (found) {
          setHoveredHosp(found.hosp);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredHosp(null);
        container.style.cursor = 'default';
      }
    };

    handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes.current.map(m => m.mesh));
      if (intersects.length > 0) {
        const found = markerMeshes.current.find(m => m.mesh === intersects[0].object);
        if (found) {
          onSelectHospital(found.hosp);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 12. IntersectionObserver for battery/GPU conservation
    observer = new IntersectionObserver((entries) => {
      isVisibleRef.current = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // 13. Throttled Animation Loop (15 FPS idle rate for smooth low CPU load)
    let lastTime = 0;
    const interval = 1000 / 15; // 66.6ms for smooth 15fps, drastically reducing CPU load

    const animate = (currentTime: number) => {
      animFrameId.current = requestAnimationFrame(animate);

      if (document.hidden || !isVisibleRef.current || !renderer || !scene) return;
      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      const time = currentTime * 0.001;

      // Animate Ambulance along avenue
      amb1.position.z = ((time * 12) % 110) - 55;

      // Smooth camera interpolation
      currentCameraPos.current.lerp(targetCameraPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.position.copy(currentCameraPos.current);
      camera.lookAt(currentLookAt.current);

      // Subtle city idle orbit when no specific hospital is focused
      if (!selectedHospital) {
        scene.rotation.y = Math.sin(time * 0.15) * 0.08;
      }

      renderer.render(scene, camera);
    };

    startTimer = setTimeout(() => {
      animFrameId.current = requestAnimationFrame(animate);
    }, 150);

    // Handle Resize
    handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    }, 350);

    return () => {
      destroyed = true;
      clearTimeout(initTimer);
      if (startTimer) clearTimeout(startTimer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (handlePointerMove && containerRef.current) containerRef.current.removeEventListener('mousemove', handlePointerMove);
      if (handleClick && containerRef.current) containerRef.current.removeEventListener('click', handleClick);
      if (observer) observer.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (renderer) renderer.dispose();
      if (scene) scene.clear();
    };
  }, [is2DMode]);

  // Adjust camera target when selectedHospital changes
  useEffect(() => {
    if (!selectedHospital) {
      targetCameraPos.current.set(0, 36, 52);
      targetLookAt.current.set(0, 0, 0);
      return;
    }

    const idx = HOSPITALS.findIndex(h => h.id === selectedHospital.id);
    const positions: [number, number, number][] = [
      [0, 20, 16],     // AIIMS focus
      [-22, 18, 10],   // Safdarjung focus
      [20, 18, 8],     // Max Super Speciality focus
      [26, 18, 38]     // Apollo focus
    ];

    if (idx >= 0 && idx < positions.length) {
      const p = positions[idx];
      targetCameraPos.current.set(p[0], p[1], p[2]);
      const lookPositions: [number, number, number][] = [
        [0, 14, -8],
        [-28, 12, -15],
        [26, 14, -18],
        [34, 12, 16]
      ];
      targetLookAt.current.set(lookPositions[idx][0], lookPositions[idx][1], lookPositions[idx][2]);
    }
  }, [selectedHospital]);

  // Controls
  const handleZoom = (factor: number) => {
    targetCameraPos.current.multiplyScalar(factor);
  };

  const handleResetCamera = () => {
    targetCameraPos.current.set(0, 36, 52);
    targetLookAt.current.set(0, 0, 0);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#FAF8F5] border border-[#C4A66B]/30 overflow-hidden shadow-xl transition-all duration-300">
      
      {/* Top Architectural Header Bar */}
      <div className="p-4 border-b border-[#C4A66B]/20 flex items-center justify-between bg-[#F1F0E9]/95 backdrop-blur-md z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold tracking-wide uppercase font-mono text-[#173E35]">
                Spatial Medical City 3D
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#173E35] text-[#F1F0E9] border border-[#C4A66B]/30">
                Interactive Hero
              </span>
            </div>
            <p className="text-[11px] text-[#173E35]/70">
              Real-time regional trauma routing · Capital Emergency Medical Corridor
            </p>
          </div>
        </div>

        {/* 2D / 3D Mode Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIs2DMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
              is2DMode
                ? 'bg-[#173E35] text-[#F1F0E9] shadow-md'
                : 'bg-white text-[#173E35] border border-[#C4A66B]/40 hover:border-[#173E35]'
            }`}
            title="Toggle between 3D Spatial City and 2D Schematic Grid"
          >
            <Layers className="w-3.5 h-3.5 text-[#C4A66B]" />
            <span>{is2DMode ? '3D City' : '2D Map'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas or 2D Schematic Fallback */}
      {!is2DMode ? (
        <div
          ref={containerRef}
          className="relative w-full h-[400px] sm:h-[460px] bg-[#F1F0E9] select-none touch-none cursor-grab active:cursor-grabbing"
          role="region"
          aria-label="3D Interactive Medical City View"
        >
          {/* Active SOS Red Border Pulse */}
          {sosActive && (
            <div className="absolute inset-0 border-2 border-[#D44A3C] animate-pulse pointer-events-none rounded-3xl" />
          )}

          {/* Interactive Navigation Controls */}
          <div className="absolute left-4 bottom-4 z-10 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#C4A66B]/40 shadow-lg">
            <button
              onClick={() => handleZoom(0.85)}
              className="p-2 rounded-xl text-[#173E35] hover:bg-[#F1F0E9] hover:text-[#C4A66B] transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1.15)}
              className="p-2 rounded-xl text-[#173E35] hover:bg-[#F1F0E9] hover:text-[#C4A66B] transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2 rounded-xl text-[#173E35] hover:bg-[#F1F0E9] hover:text-[#C4A66B] transition-colors"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#C4A66B]/30 mx-1" />
            <button
              onClick={() => {
                targetCameraPos.current.set(0, 20, 16);
                targetLookAt.current.set(0, 14, -8);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#173E35] hover:bg-[#F1F0E9] transition-colors flex items-center space-x-1 font-bold"
              title="Focus AIIMS Trauma Center"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#D44A3C]" />
              <span>AIIMS</span>
            </button>
          </div>

          {/* Floating Key / Legend */}
          <div className="absolute right-4 bottom-4 z-10 hidden sm:flex flex-col space-y-1.5 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#C4A66B]/30 text-[11px] font-mono shadow-lg text-[#173E35]">
            <div className="text-[10px] text-[#7A5E2E] font-bold uppercase tracking-wider mb-0.5">
              Trauma Grid Legend
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#D44A3C] rounded-xs flex items-center justify-center text-white text-[8px] font-black">
                +
              </div>
              <span>Level 1 Trauma Complex</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#173E35] rounded-full" />
              <span>General Hospital</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7A5E2E]" />
              <span>Ambulance Arterial Route</span>
            </div>
          </div>

          {/* Hover Tooltip */}
          {hoveredHosp && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C4A66B] shadow-xl text-left min-w-[200px]">
              <div className="text-[10px] font-mono uppercase font-bold text-[#7A5E2E]">
                {hoveredHosp.category}
              </div>
              <h4 className="text-xs font-bold text-[#173E35] mt-0.5">{hoveredHosp.name}</h4>
              <p className="text-[10px] text-[#173E35]/85 font-mono mt-1 font-medium">
                {hoveredHosp.icuBedsAvailable} ICU Beds Available · Click to Inspect
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 2D Schematic Plan Fallback */
        <div className="p-6 bg-[#FAF8F5] min-h-[420px] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/20">
              <h4 className="text-sm font-bold text-[#173E35]">
                2D Regional Emergency Grid
              </h4>
              <span className="text-xs font-mono text-[#7A5E2E] font-bold">
                {HOSPITALS.length} Verified Facilities Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOSPITALS.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => onSelectHospital(hosp)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-white border-[#173E35] shadow-md ring-2 ring-[#C4A66B]/50'
                        : 'bg-white/80 border-[#C4A66B]/20 hover:border-[#173E35]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase">
                        {hosp.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#D44A3C]">
                        {hosp.erWaitTime}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-[#173E35] mt-1">{hosp.name}</h5>
                    <p className="text-[11px] text-[#173E35]/85 mt-0.5 line-clamp-1">{hosp.address}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Hospital Quick Action Footer */}
      {selectedHospital && (
        <div className="p-4 bg-white border-t border-[#C4A66B]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#F1F0E9] shrink-0 font-bold text-xs">
              {selectedHospital.category === 'Trauma Center Level 1' ? 'L1' : 'ER'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#173E35]">{selectedHospital.name}</span>
                <span className="text-[10px] font-mono text-[#7A5E2E] px-2 py-0.5 rounded-full bg-[#F1F0E9] border border-[#C4A66B]/40 font-bold">
                  {selectedHospital.category}
                </span>
              </div>
              <p className="text-[11px] text-[#173E35]/85 font-medium">
                {selectedHospital.icuBedsAvailable} ICU beds · Phone: {selectedHospital.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={`https://maps.google.com/?q=${selectedHospital.latLong.lat},${selectedHospital.latLong.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#173E35] text-[#F1F0E9] text-xs font-bold font-mono hover:bg-[#0E2721] transition-colors text-center"
            >
              Turn-by-Turn GPS
            </a>
            <a
              href={`tel:${selectedHospital.phone}`}
              className="px-3.5 py-2 rounded-xl bg-[#CC3B2D] text-white hover:bg-[#B53225] text-xs font-mono transition-colors font-bold"
            >
              Call ER
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
