import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Hospital } from '../types';
import { HOSPITALS } from '../data/mockData';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  MapPin,
  Layers,
  Info,
  ExternalLink
} from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (h: Hospital) => void;
  sosActive?: boolean;
}

// Global anchor medical hubs for context
const GLOBAL_HUBS = [
  { name: 'WHO Headquarters', city: 'Geneva', lat: 46.2044, lng: 6.1432, type: 'Global Health Hub' },
  { name: 'St Thomas Hospital', city: 'London', lat: 51.4988, lng: -0.1186, type: 'Trauma & Research' },
  { name: 'Johns Hopkins Hospital', city: 'Baltimore', lat: 39.2965, lng: -76.5927, type: 'Critical Care' },
  { name: 'Singapore General Hospital', city: 'Singapore', lat: 1.2798, lng: 103.8344, type: 'Regional Triage' },
  { name: 'Tokyo Univ Hospital', city: 'Tokyo', lat: 35.7126, lng: 139.7619, type: 'Emergency Center' }
];

// Helper: converts lat/lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate an authentic world map canvas texture in Warm Ivory & Forest Green (Optimized 1024x512)
function createEarthCanvasTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Forest Green Ocean Base (#173E35)
  ctx.fillStyle = '#173E35';
  ctx.fillRect(0, 0, width, height);

  // Subtle ocean bathymetry
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0E2721');
  oceanGrad.addColorStop(0.5, '#173E35');
  oceanGrad.addColorStop(1, '#0E2721');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Graticule Lines (Muted Champagne)
  ctx.strokeStyle = 'rgba(199, 174, 123, 0.18)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += width / 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += height / 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Equator
  ctx.strokeStyle = 'rgba(199, 174, 123, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // 3. Continent Polygons in Warm Ivory (#F1F0E9) with Champagne Outlines (#C4A66B)
  ctx.fillStyle = '#F1F0E9';
  ctx.strokeStyle = '#C4A66B';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';

  const mapX = (lng: number) => ((lng + 180) / 360) * width;
  const mapY = (lat: number) => ((90 - lat) / 180) * height;

  const drawPolygon = (coords: [number, number][]) => {
    if (coords.length === 0) return;
    ctx.beginPath();
    const [firstLng, firstLat] = coords[0];
    ctx.moveTo(mapX(firstLng), mapY(firstLat));
    for (let i = 1; i < coords.length; i++) {
      const [lng, lat] = coords[i];
      ctx.lineTo(mapX(lng), mapY(lat));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Eurasia (Europe + Asia + Indian Subcontinent)
  drawPolygon([
    [-9, 36], [-9, 44], [0, 48], [8, 54], [12, 57], [28, 71], [40, 68], [60, 73], [75, 73],
    [105, 77], [135, 72], [170, 66], [180, 65], [170, 60], [155, 58], [142, 53], [130, 43],
    [122, 38], [120, 31], [115, 22], [108, 15], [105, 10], [100, 5], [98, 15], [90, 22],
    [88, 22], [80, 13], [77, 8], [73, 15], [72, 21], [68, 24],
    [62, 25], [56, 26], [50, 27], [45, 13], [43, 12], [35, 27], [35, 32], [28, 41],
    [18, 40], [14, 38], [3, 42], [-5, 36]
  ]);

  // Indian Subcontinent Detail Accent
  drawPolygon([
    [68, 24], [72, 32], [76, 35], [82, 30], [88, 26], [92, 24], [90, 21],
    [86, 20], [82, 16], [80, 13], [77, 8], [75, 12], [73, 16], [70, 21]
  ]);

  // Africa
  drawPolygon([
    [-17, 15], [-17, 21], [-5, 36], [10, 37], [12, 33], [25, 32], [32, 31], [35, 27],
    [43, 12], [51, 12], [42, -4], [40, -11], [35, -25], [26, -33], [18, -34], [12, -20],
    [9, 5], [3, 6], [-5, 5], [-15, 11]
  ]);

  // North America
  drawPolygon([
    [-168, 66], [-160, 71], [-130, 70], [-95, 73], [-80, 60], [-60, 55], [-65, 44],
    [-75, 35], [-80, 25], [-82, 24], [-97, 26], [-97, 20], [-90, 16], [-83, 10],
    [-80, 8], [-85, 12], [-105, 22], [-117, 32], [-124, 40], [-125, 49], [-140, 59],
    [-160, 55], [-168, 65]
  ]);

  // South America
  drawPolygon([
    [-77, 8], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-40, -22], [-50, -32],
    [-58, -38], [-68, -55], [-75, -50], [-72, -38], [-71, -30], [-76, -15], [-80, -5],
    [-80, 2], [-77, 8]
  ]);

  // Australia
  drawPolygon([
    [114, -22], [122, -17], [130, -13], [136, -12], [142, -11], [148, -20], [153, -28],
    [150, -37], [140, -38], [135, -34], [124, -34], [115, -34], [113, -26]
  ]);

  // Regional nodes
  ctx.fillStyle = 'rgba(199, 174, 123, 0.45)';
  const keyCoords: [number, number][] = [
    [77.2, 28.6], // Delhi
    [72.8, 19.0], // Mumbai
    [88.3, 22.5], // Kolkata
    [80.2, 13.0], // Chennai
    [0.1, 51.5],  // London
    [6.1, 46.2],  // Geneva
    [139.7, 35.7], // Tokyo
    [-74.0, 40.7] // New York
  ];
  keyCoords.forEach(([lng, lat]) => {
    ctx.beginPath();
    ctx.arc(mapX(lng), mapY(lat), 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export const SpatialHealthGlobe: React.FC<Props> = ({
  selectedHospital,
  onSelectHospital,
  sosActive = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hoveredHospital, setHoveredHospital] = useState<Hospital | null>(null);
  const [is2DMode, setIs2DMode] = useState<boolean>(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.35, y: -1.35 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.35, y: -1.35 });
  const zoomLevelRef = useRef<number>(5.2);
  const targetZoomRef = useRef<number>(5.2);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isVisibleRef = useRef<boolean>(true);

  // Focus globe rotation on a coordinate
  const focusOnLatLng = useCallback((lat: number, lng: number) => {
    const targetY = -(lng * (Math.PI / 180)) - Math.PI / 2;
    const targetX = lat * (Math.PI / 180);
    targetRotation.current = { x: targetX, y: targetY };
    targetZoomRef.current = 4.4;
  }, []);

  useEffect(() => {
    if (selectedHospital?.latLong) {
      focusOnLatLng(selectedHospital.latLong.lat, selectedHospital.latLong.lng);
    }
  }, [selectedHospital, focusOnLatLng]);

  // Main Three.js Initialization
  useEffect(() => {
    if (is2DMode || !mountRef.current) return;

    const container = mountRef.current;
    let isCancelled = false;

    // Observe visibility to avoid rendering when scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const initTimeout = setTimeout(() => {
      if (isCancelled || !mountRef.current) return;

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 420;

      // 1. Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 0, zoomLevelRef.current);
      cameraRef.current = camera;

      // 3. Renderer with power-efficiency
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        precision: 'mediump'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Globe Root Group
      const globeGroup = new THREE.Group();
      globeGroup.rotation.x = currentRotation.current.x;
      globeGroup.rotation.y = currentRotation.current.y;
      scene.add(globeGroup);
      globeGroupRef.current = globeGroup;

      // 5. Lighting
      const ambientLight = new THREE.AmbientLight(0xF1F0E9, 1.2);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xFFF9E8, 1.8);
      sunLight.position.set(6, 4, 7);
      scene.add(sunLight);

      // 6. Base Sphere Mesh (Optimized 40x40 segments)
      const radius = 2.0;
      const globeGeo = new THREE.SphereGeometry(radius, 40, 40);
      const earthTexture = createEarthCanvasTexture();
      const globeMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.7,
        metalness: 0.1
      });
      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      globeGroup.add(globeMesh);

      // 7. Atmosphere Ethereal Halo
      const atmosphereGeo = new THREE.SphereGeometry(radius * 1.025, 32, 32);
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0xC4A66B,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
      });
      const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
      globeGroup.add(atmosphereMesh);

      // 8. Markers Group
      const markersGroup = new THREE.Group();
      globeGroup.add(markersGroup);
      markersGroupRef.current = markersGroup;

      // Shared Geometries & Materials
      const pinStemGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.16, 8);
      const crossHorizGeo = new THREE.BoxGeometry(0.12, 0.04, 0.04);
      const crossVertGeo = new THREE.BoxGeometry(0.04, 0.12, 0.04);
      const diamondGeo = new THREE.OctahedronGeometry(0.06, 0);

      const vermilionMat = new THREE.MeshBasicMaterial({ color: 0xD44A3C });
      const champagneMat = new THREE.MeshBasicMaterial({ color: 0xC4A66B });
      const ivoryMat = new THREE.MeshBasicMaterial({ color: 0xF1F0E9 });

      // Populate Delhi Hospital Markers
      HOSPITALS.forEach((hosp) => {
        const pos = latLngToVector3(hosp.latLong.lat, hosp.latLong.lng, radius);
        const markerRoot = new THREE.Group();
        markerRoot.position.copy(pos);
        markerRoot.lookAt(pos.clone().multiplyScalar(2));

        const stem = new THREE.Mesh(pinStemGeo, champagneMat);
        stem.position.z = 0.08;
        stem.rotation.x = Math.PI / 2;
        markerRoot.add(stem);

        let headMesh: THREE.Object3D;
        if (hosp.category === 'Trauma Center Level 1') {
          const crossGroup = new THREE.Group();
          const ch = new THREE.Mesh(crossHorizGeo, vermilionMat);
          const cv = new THREE.Mesh(crossVertGeo, vermilionMat);
          crossGroup.add(ch, cv);
          headMesh = crossGroup;
        } else if (hosp.category === 'Cardiac Emergency') {
          headMesh = new THREE.Mesh(diamondGeo, vermilionMat);
        } else {
          headMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05, 0), champagneMat);
        }
        headMesh.position.z = 0.18;
        markerRoot.add(headMesh);

        // Ring
        const ringGeo = new THREE.RingGeometry(0.04, 0.07, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: hosp.category === 'Trauma Center Level 1' ? 0xD44A3C : 0xC4A66B,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = 0.01;
        markerRoot.add(ring);

        markerRoot.userData = { hospital: hosp, ringMesh: ring };
        markersGroup.add(markerRoot);
      });

      // Populate Global Anchor Hubs
      GLOBAL_HUBS.forEach((hub) => {
        const pos = latLngToVector3(hub.lat, hub.lng, radius);
        const hubRoot = new THREE.Group();
        hubRoot.position.copy(pos);
        hubRoot.lookAt(pos.clone().multiplyScalar(2));

        const hubDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), ivoryMat);
        hubDot.position.z = 0.04;
        hubRoot.add(hubDot);

        const hubRing = new THREE.Mesh(
          new THREE.RingGeometry(0.04, 0.06, 12),
          new THREE.MeshBasicMaterial({ color: 0xC4A66B, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        );
        hubRing.position.z = 0.01;
        hubRoot.add(hubRing);

        hubRoot.userData = { isHub: true, name: hub.name, city: hub.city, type: hub.type };
        markersGroup.add(hubRoot);
      });

      // Resize
      const handleResize = () => {
        if (!container || !rendererRef.current || !cameraRef.current) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        cameraRef.current.aspect = newW / newH;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop with 30fps throttle when not interacting
      let time = 0;
      let lastFrameTime = performance.now();
      const targetFrameInterval = 1000 / 30; // 30 FPS cap for idle smooth rendering

      const animate = (now: number) => {
        animationFrameRef.current = requestAnimationFrame(animate);

        if (!isVisibleRef.current || document.hidden) return;

        const delta = now - lastFrameTime;
        if (!isDraggingRef.current && delta < targetFrameInterval) return;
        lastFrameTime = now;

        time += 0.032;

        zoomLevelRef.current += (targetZoomRef.current - zoomLevelRef.current) * 0.08;
        if (cameraRef.current) {
          cameraRef.current.position.z = zoomLevelRef.current;
        }

        if (!isDraggingRef.current) {
          if (isPlaying) {
            targetRotation.current.y += 0.0018;
          }
        }

        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.x = currentRotation.current.x;
          globeGroupRef.current.rotation.y = currentRotation.current.y;
        }

        if (markersGroupRef.current) {
          markersGroupRef.current.children.forEach((child) => {
            if (child.userData?.ringMesh) {
              const isSelected = selectedHospital?.id === child.userData?.hospital?.id;
              const pulseScale = 1 + Math.sin(time * 3) * (isSelected ? 0.35 : 0.15);
              child.userData.ringMesh.scale.set(pulseScale, pulseScale, 1);
            }
          });
        }

        renderer.render(scene, camera);
      };
      animationFrameRef.current = requestAnimationFrame(animate);

      // Check user preference for reduced motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    }, 50);

    return () => {
      isCancelled = true;
      clearTimeout(initTimeout);
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [is2DMode, isPlaying]);

  // Pointer & Raycast Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !globeGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const xRel = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const yRel = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseVecRef.current.set(xRel, yRel);

    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x = Math.max(-1.2, Math.min(1.2, targetRotation.current.x + deltaY * 0.008));
      return;
    }

    if (markersGroupRef.current) {
      raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(markersGroupRef.current.children, true);

      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && !rootObj.userData?.hospital && !rootObj.userData?.isHub && rootObj.parent) {
          rootObj = rootObj.parent;
        }

        if (rootObj && rootObj.userData?.hospital) {
          setHoveredHospital(rootObj.userData.hospital);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          mountRef.current.style.cursor = 'pointer';
          return;
        }
      }
    }

    setHoveredHospital(null);
    setTooltipPos(null);
    if (mountRef.current) mountRef.current.style.cursor = 'grab';
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;

    if (!mountRef.current || !cameraRef.current || !markersGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const xRel = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const yRel = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseVecRef.current.set(xRel, yRel);

    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(markersGroupRef.current.children, true);

    if (intersects.length > 0) {
      let rootObj: THREE.Object3D | null = intersects[0].object;
      while (rootObj && !rootObj.userData?.hospital && rootObj.parent) {
        rootObj = rootObj.parent;
      }
      if (rootObj && rootObj.userData?.hospital) {
        const hosp = rootObj.userData.hospital as Hospital;
        onSelectHospital(hosp);
        focusOnLatLng(hosp.latLong.lat, hosp.latLong.lng);
      }
    }
  };

  const handleZoomIn = () => {
    targetZoomRef.current = Math.max(3.2, targetZoomRef.current - 0.6);
  };
  const handleZoomOut = () => {
    targetZoomRef.current = Math.min(7.5, targetZoomRef.current + 0.6);
  };
  const handleReset = () => {
    focusOnLatLng(28.5672, 77.2100);
    targetZoomRef.current = 5.2;
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full rounded-3xl clinic-panel border border-[#C4A66B]/25 overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Top Header Bar */}
      <div className="p-4 border-b border-[#F1F0E9]/10 flex items-center justify-between bg-[#0E2721]/80 backdrop-blur-md z-10 relative">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold tracking-wide uppercase font-mono text-[#F1F0E9]">
                Spatial Health Globe
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0E2721] text-[#D6B77C] border border-[#C4A66B]/30">
                Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-[#F1F0E9]/70">
              Spherical triage coordinates · Delhi Capital Region & International Care Hubs
            </p>
          </div>
        </div>

        {/* 2D / 3D Mode Switch */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIs2DMode(!is2DMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all ${
              is2DMode
                ? 'bg-[#F1F0E9] text-[#18231F] shadow-md'
                : 'bg-[#173E35] text-[#F1F0E9] border border-[#C4A66B]/30 hover:border-[#C4A66B]'
            }`}
            title="Toggle between 3D WebGL sphere and accessible 2D projection"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{is2DMode ? '3D Globe' : '2D Map'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL View Container */}
      {!is2DMode ? (
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[400px] sm:h-[460px] bg-gradient-to-b from-[#0E2721] via-[#173E35] to-[#0E2721] select-none touch-none cursor-grab active:cursor-grabbing"
          role="region"
          aria-label="Interactive 3D Spatial Health Globe showing hospitals and medical centers"
        >
          {sosActive && (
            <div className="absolute inset-0 border-2 border-[#D44A3C] animate-pulse pointer-events-none rounded-3xl" />
          )}

          {/* Floated Camera Controls */}
          <div className="absolute left-4 bottom-4 z-10 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-[#0E2721]/85 backdrop-blur-md border border-[#C4A66B]/30 shadow-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl text-[#F1F0E9] hover:bg-[#173E35] hover:text-[#C4A66B] transition-colors"
              title={isPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
              aria-label={isPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl text-[#F1F0E9] hover:bg-[#173E35] hover:text-[#C4A66B] transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl text-[#F1F0E9] hover:bg-[#173E35] hover:text-[#C4A66B] transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#C4A66B]/30 mx-1" />
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#C4A66B] hover:bg-[#173E35] transition-colors flex items-center space-x-1"
              title="Center on Delhi Capital Region"
              aria-label="Center on Delhi Capital Region"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delhi NCR</span>
            </button>
          </div>

          {/* Legend Overlay */}
          <div className="absolute right-4 bottom-4 z-10 hidden sm:flex flex-col space-y-1.5 p-3 rounded-2xl bg-[#0E2721]/85 backdrop-blur-md border border-[#C4A66B]/25 text-[11px] font-mono shadow-xl">
            <div className="text-[10px] text-[#C4A66B] font-bold uppercase tracking-wider mb-1">
              Beacon Geometry
            </div>
            <div className="flex items-center space-x-2 text-[#F1F0E9]">
              <div className="w-3 h-3 bg-[#D44A3C] rounded-xs flex items-center justify-center text-white text-[8px] font-black">
                +
              </div>
              <span>Level 1 Trauma (AIIMS)</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F1F0E9]">
              <div className="w-2.5 h-2.5 bg-[#D44A3C] rotate-45" />
              <span>Cardiac Emergency (Max/Fortis)</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F1F0E9]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C4A66B]" />
              <span>General Hospital (Safdarjung)</span>
            </div>
            <div className="text-[9px] text-[#C4A66B]/70 pt-1 border-t border-[#C4A66B]/20">
              * Bed wait-times tagged as Demo data
            </div>
          </div>

          {/* Interactive Tooltip */}
          {hoveredHospital && tooltipPos && (
            <div
              className="absolute z-20 pointer-events-none p-3.5 rounded-2xl bg-[#0E2721]/95 backdrop-blur-lg border border-[#C4A66B] shadow-2xl text-left min-w-[220px]"
              style={{
                left: Math.min(tooltipPos.x + 16, (mountRef.current?.clientWidth || 600) - 240),
                top: Math.max(tooltipPos.y - 70, 16)
              }}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#F1F0E9]/10">
                <span className="text-[10px] font-mono uppercase font-bold text-[#C4A66B]">
                  {hoveredHospital.category}
                </span>
                <span className="text-[10px] font-mono text-[#F79488] font-bold">
                  {hoveredHospital.distance}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#F1F0E9] mt-1.5 leading-snug">
                {hoveredHospital.name}
              </h4>
              <p className="text-[10px] text-[#F1F0E9]/80 mt-0.5 line-clamp-1">
                {hoveredHospital.address}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#F1F0E9]/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">
                  {hoveredHospital.licensedBedsReference ? `${hoveredHospital.licensedBedsReference} Licensed Beds (Ref)` : hoveredHospital.category}
                </span>
                <span className="text-[#C4A66B]">
                  Verified: {hoveredHospital.verifiedAt}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible 2D Planar Map Projection Fallback */
        <div className="p-6 bg-[#0E2721] min-h-[420px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F0E9]/15">
              <h4 className="text-sm font-bold font-editorial italic text-[#F1F0E9]">
                Planar Care Grid — Delhi NCR Emergency Facilities
              </h4>
              <span className="text-xs font-mono text-[#C4A66B]">
                High-Contrast Accessible View
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {HOSPITALS.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <button
                    key={hosp.id}
                    onClick={() => onSelectHospital(hosp)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#173E35] border-[#C4A66B] shadow-lg ring-1 ring-[#C4A66B]'
                        : 'bg-[#0E2721]/80 border-[#F1F0E9]/15 hover:border-[#C4A66B]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-[#C4A66B] uppercase">
                        {hosp.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F79488]">
                        {hosp.distance} ({hosp.driveTime})
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#F1F0E9]">{hosp.name}</h5>
                    <p className="text-xs text-[#F1F0E9]/75 mt-0.5">{hosp.address}</p>
                    <div className="mt-3 pt-2 border-t border-[#F1F0E9]/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-semibold">
                        {hosp.licensedBedsReference ? `${hosp.licensedBedsReference} Licensed Beds (Ref)` : hosp.category}
                      </span>
                      <span className="text-[#F1F0E9]/80 font-bold">
                        Verified: {hosp.verifiedAt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#173E35]/60 border border-[#C4A66B]/30 text-xs text-[#F1F0E9]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#C4A66B] shrink-0" />
              <span>
                Coordinates calibrated for Delhi Trauma Centers. Screen-reader and keyboard navigable.
              </span>
            </div>
            <button
              onClick={() => setIs2DMode(false)}
              className="text-xs font-mono text-[#C4A66B] hover:underline shrink-0 ml-2"
            >
              Back to 3D Globe &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Bottom Selected Facility Summary Strip */}
      {selectedHospital && (
        <div className="p-4 bg-[#173E35]/95 border-t border-[#C4A66B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0E2721] border border-[#C4A66B]/40 flex items-center justify-center text-[#F79488] shrink-0 font-bold">
              {selectedHospital.category === 'Trauma Center Level 1' ? '+' : 'H'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#F1F0E9]">{selectedHospital.name}</span>
                <span className="text-[10px] font-mono text-[#C4A66B] px-2 py-0.5 rounded-full bg-[#0E2721] border border-[#C4A66B]/30">
                  Focused Target
                </span>
              </div>
              <p className="text-xs text-[#F1F0E9]/75">
                {selectedHospital.specialties.slice(0, 3).join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <a
              href={`tel:${selectedHospital.phone.replace(/[^0-9+]/g, '')}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#F1F0E9] text-[#18231F] text-xs font-bold font-mono hover:bg-white transition-colors text-center"
            >
              Call {selectedHospital.phone}
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedHospital.name + ' ' + selectedHospital.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#0E2721] text-[#C4A66B] border border-[#C4A66B]/30 hover:border-[#C4A66B] text-xs font-mono transition-colors flex items-center space-x-1.5"
            >
              <span>Map Route</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
