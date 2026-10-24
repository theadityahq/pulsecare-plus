import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Hospital } from '../types';
import { HOSPITALS } from '../data/mockData';
import { LocationTelemetry } from '../services/locationService';
import { SatelliteMapView } from './SatelliteMapView';
import {
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  Phone,
  Crosshair,
  Building2,
  Clock,
  Bed,
  CheckCircle2,
  X,
  Globe
} from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
  sosActive: boolean;
  hospitals?: Hospital[];
  currentLocation?: LocationTelemetry;
}

// 3D world coordinates for floating hospital labels
const HOSPITAL_LABEL_COORDS: [number, number, number][] = [
  [-11, 9.6, -11], // Landmark (Apex Trauma)
  [12, 8.4, -11],  // Secondary North-East
  [-12, 10.6, 12], // South-West (Cardiac)
  [13, 8.6, 14]    // South-East
];

export const SpatialMedicalCity: React.FC<Props> = ({
  selectedHospital,
  onSelectHospital,
  sosActive,
  hospitals,
  currentLocation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'satellite' | '2d'>('3d');
  const [hoveredHosp, setHoveredHosp] = useState<Hospital | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeHospitals = hospitals && hospitals.length >= 4 ? hospitals : HOSPITALS;
  const regionId = currentLocation?.regionId || 'delhi';

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Camera Orbit & Target Vectors (Default: Elevated 3/4 Isometric View)
  const DEFAULT_CAM_POS = new THREE.Vector3(50, 44, 50);
  const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0);

  const targetCameraPos = useRef(DEFAULT_CAM_POS.clone());
  const currentCameraPos = useRef(DEFAULT_CAM_POS.clone());
  const targetLookAt = useRef(DEFAULT_LOOK_AT.clone());
  const currentLookAt = useRef(DEFAULT_LOOK_AT.clone());

  // Interactive Drag / Orbit State
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const previousPinchDist = useRef(0);
  const sphericalCoords = useRef({ radius: 82, theta: Math.PI / 4, phi: Math.PI / 3.4 });

  // Raycasting & Facility Meshes Map
  const facilityInteractiveMeshes = useRef<{ mesh: THREE.Object3D; hosp: Hospital }[]>([]);

  // Update camera target when selectedHospital changes
  useEffect(() => {
    if (!selectedHospital) {
      targetCameraPos.current.copy(DEFAULT_CAM_POS);
      targetLookAt.current.copy(DEFAULT_LOOK_AT);
      sphericalCoords.current = { radius: 82, theta: Math.PI / 4, phi: Math.PI / 3.4 };
      return;
    }

    const hospPositions: Record<string, { look: [number, number, number]; offset: [number, number, number] }> = {
      [activeHospitals[0]?.id || 'hosp-1']: { look: [-11, 3.5, -11], offset: [28, 26, 28] }, // Landmark
      [activeHospitals[1]?.id || 'hosp-2']: { look: [12, 3.5, -11], offset: [28, 26, 28] },  // Secondary North-East
      [activeHospitals[2]?.id || 'hosp-3']: { look: [-12, 3.5, 12], offset: [28, 26, 28] },  // South-West
      [activeHospitals[3]?.id || 'hosp-4']: { look: [13, 3.5, 14], offset: [28, 26, 28] }   // South-East
    };

    const target = hospPositions[selectedHospital.id] || { look: [0, 2, 0], offset: [35, 32, 35] };
    targetLookAt.current.set(target.look[0], target.look[1], target.look[2]);
    targetCameraPos.current.set(
      target.look[0] + target.offset[0],
      target.look[1] + target.offset[1],
      target.look[2] + target.offset[2]
    );

    sphericalCoords.current.radius = targetCameraPos.current.distanceTo(targetLookAt.current);
  }, [selectedHospital, activeHospitals]);

  // Handle Zoom In / Out
  const handleZoom = (factor: number) => {
    const dir = new THREE.Vector3().subVectors(targetCameraPos.current, targetLookAt.current);
    let newDist = dir.length() * factor;
    newDist = THREE.MathUtils.clamp(newDist, 40, 115);
    dir.setLength(newDist);
    targetCameraPos.current.copy(targetLookAt.current).add(dir);
    sphericalCoords.current.radius = newDist;
  };

  // Reset Camera to City-Wide Isometric Framing
  const handleResetCamera = useCallback(() => {
    targetCameraPos.current.copy(DEFAULT_CAM_POS);
    targetLookAt.current.copy(DEFAULT_LOOK_AT);
    sphericalCoords.current = { radius: 82, theta: Math.PI / 4, phi: Math.PI / 3.4 };
    onSelectHospital(null as any);
  }, [onSelectHospital]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    if (viewMode !== '3d' || !containerRef.current) return;

    let destroyed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let observer: IntersectionObserver | null = null;
    let animId: number | null = null;
    let startTimer: any = null;

    // Handlers
    let onMouseDown: ((e: MouseEvent) => void) | null = null;
    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onMouseUp: (() => void) | null = null;
    let onTouchStart: ((e: TouchEvent) => void) | null = null;
    let onTouchMove: ((e: TouchEvent) => void) | null = null;
    let onTouchEnd: (() => void) | null = null;
    let onWheel: ((e: WheelEvent) => void) | null = null;
    let onResize: (() => void) | null = null;
    let onPointerHover: ((e: MouseEvent) => void) | null = null;
    let onClickSelect: ((e: MouseEvent) => void) | null = null;

    // Defer initialization slightly to let browser complete initial paint with 0 blocking time
    const initTimer = setTimeout(() => {
      if (destroyed || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 460;

      // 1. Scene & Warm Ivory Atmosphere
      const currentScene = new THREE.Scene();
      scene = currentScene;
      currentScene.background = new THREE.Color(0xF4F0E6); // Future Clinic Warm Ivory
      currentScene.fog = new THREE.FogExp2(0xF4F0E6, 0.008);
      sceneRef.current = currentScene;

      // 2. Camera: Telephoto 32° FOV for authentic architectural isometric appearance
      const currentCamera = new THREE.PerspectiveCamera(32, width / height, 1, 600);
      camera = currentCamera;
      currentCamera.position.copy(currentCameraPos.current);
      currentCamera.lookAt(currentLookAt.current);
      cameraRef.current = currentCamera;

      // 3. WebGL Renderer with pixel ratio cap for optimal FPS
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          precision: 'mediump'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;
      } catch (err) {
        console.warn('WebGL initialization failed, falling back to 2D view', err);
        setViewMode('2d');
        return;
      }

      // 4. Balanced Architectural Lighting
      const ambientLight = new THREE.AmbientLight(0xFFFBF2, 1.8);
      currentScene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xFDF8EE, 1.9);
      sunLight.position.set(65, 80, 50);
      currentScene.add(sunLight);

      const fillLight = new THREE.DirectionalLight(0xC7AE7B, 0.7);
      fillLight.position.set(-45, 30, -45);
      currentScene.add(fillLight);

      // ==========================================
      // PALETTE MATERIALS & REGIONAL ACCENTS
      // ==========================================
      const matIvory = new THREE.MeshStandardMaterial({ color: 0xF4F0E6, roughness: 0.35, metalness: 0.1 });
      const matDeepGreen = new THREE.MeshStandardMaterial({ color: 0x163C32, roughness: 0.45, metalness: 0.2 });
      const matVermilion = new THREE.MeshStandardMaterial({ color: 0xB82819, roughness: 0.3 });
      const matChampagne = new THREE.MeshStandardMaterial({ color: 0xC7AE7B, roughness: 0.5, metalness: 0.25 });
      const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x1D2521, roughness: 0.8 });
      const matGlass = new THREE.MeshStandardMaterial({ color: 0x8DB5A6, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.85 });
      
      // Regional landscape color adaptations
      const lawnColor = regionId === 'bengaluru' ? 0x24634B : regionId === 'geneva' ? 0x32614E : 0x3E7B62;
      const matLawn = new THREE.MeshStandardMaterial({ color: lawnColor, roughness: 0.9 });
      const matSidewalk = new THREE.MeshStandardMaterial({ color: 0xEDE9DE, roughness: 0.7 });
      const matWhiteMarking = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const matWood = new THREE.MeshStandardMaterial({ color: 0x7A5E3A, roughness: 0.8 });
      const matTreeLeaves = new THREE.MeshStandardMaterial({
        color: regionId === 'geneva' ? 0x1A4432 : regionId === 'mumbai' ? 0x2A704E : 0x2E664E,
        roughness: 0.85
      });

      // Regional building trim material
      const landmarkTrimColor =
        regionId === 'london' ? 0x943126 :
        regionId === 'kolkata' ? 0x8A3324 :
        regionId === 'bengaluru' ? 0x163C32 :
        regionId === 'geneva' ? 0xC7AE7B : 0x163C32;
      const matLandmarkTrim = new THREE.MeshStandardMaterial({ color: landmarkTrimColor, roughness: 0.4, metalness: 0.2 });

      // Shared Geometries
      const treeTrunkGeom = new THREE.CylinderGeometry(0.14, 0.18, 1.2, 8);
      const treeFoliageGeom = regionId === 'geneva'
        ? new THREE.ConeGeometry(0.85, 2.0, 8)
        : new THREE.SphereGeometry(0.85, 12, 12);
      const windowStripGeomH = new THREE.BoxGeometry(1, 0.5, 0.05);

      // Helper function to plant a stylized architectural tree
      const addTree = (x: number, z: number, scale = 1) => {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, 0.15, z);

        const trunk = new THREE.Mesh(treeTrunkGeom, matWood);
        trunk.position.y = 0.6 * scale;
        trunk.scale.set(scale, scale, scale);
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(treeFoliageGeom, matTreeLeaves);
        foliage.position.y = (1.2 + 0.6) * scale;
        foliage.scale.set(scale, scale * 1.15, scale);
        treeGroup.add(foliage);

        currentScene.add(treeGroup);
      };

      // Helper function to build a building with ribbon windows
      const createBuilding = (w: number, h: number, d: number, x: number, z: number, mainMat = matIvory, trimMat = matDeepGreen) => {
        const group = new THREE.Group();
        group.position.set(x, 0.15, z);

        const bodyGeom = new THREE.BoxGeometry(w, h, d);
        const bodyMesh = new THREE.Mesh(bodyGeom, mainMat);
        bodyMesh.position.y = h / 2;
        group.add(bodyMesh);

        const plinthGeom = new THREE.BoxGeometry(w + 0.4, 0.3, d + 0.4);
        const plinthMesh = new THREE.Mesh(plinthGeom, trimMat);
        plinthMesh.position.y = 0.15;
        group.add(plinthMesh);

        const roofTrimGeom = new THREE.BoxGeometry(w + 0.2, 0.4, d + 0.2);
        const roofTrim = new THREE.Mesh(roofTrimGeom, trimMat);
        roofTrim.position.y = h + 0.2;
        group.add(roofTrim);

        const floors = Math.floor(h / 1.8);
        for (let f = 1; f <= floors; f++) {
          const winY = f * 1.6;
          if (winY < h - 0.6) {
            const bandF = new THREE.Mesh(windowStripGeomH, matGlass);
            bandF.scale.set(w * 0.85, 0.65, 1);
            bandF.position.set(0, winY, d / 2 + 0.03);
            group.add(bandF);

            const bandB = new THREE.Mesh(windowStripGeomH, matGlass);
            bandB.scale.set(w * 0.85, 0.65, 1);
            bandB.position.set(0, winY, -d / 2 - 0.03);
            group.add(bandB);
          }
        }

        currentScene.add(group);
        return { group, h, w, d, x, z };
      };

      // ==========================================
      // 5. DIORAMA BASE & PLATFORM PEDESTAL
      // ==========================================
      const dioramaBase = new THREE.Mesh(
        new THREE.BoxGeometry(66, 1.2, 66),
        new THREE.MeshStandardMaterial({ color: 0xE5DFD0, roughness: 0.9 })
      );
      dioramaBase.position.y = -0.6;
      currentScene.add(dioramaBase);

      // Sidewalk Top Slab (Ground Plazas)
      const groundPlaza = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), matSidewalk);
      groundPlaza.rotation.x = -Math.PI / 2;
      groundPlaza.position.y = 0.02;
      currentScene.add(groundPlaza);

      // ==========================================
      // 6. STREET NETWORK & PEDESTRIAN CROSSINGS
      // ==========================================
      const roadGroup = new THREE.Group();

      const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(64, 5.0), matCharcoal);
      roadEW.rotation.x = -Math.PI / 2;
      roadEW.position.set(0, 0.04, 0);
      roadGroup.add(roadEW);

      const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 64), matCharcoal);
      roadNS.rotation.x = -Math.PI / 2;
      roadNS.position.set(0, 0.04, 0);
      roadGroup.add(roadNS);

      const ringNorth = new THREE.Mesh(new THREE.PlaneGeometry(64, 3.6), matCharcoal);
      ringNorth.rotation.x = -Math.PI / 2;
      ringNorth.position.set(0, 0.04, -26);
      roadGroup.add(ringNorth);

      const ringSouth = new THREE.Mesh(new THREE.PlaneGeometry(64, 3.6), matCharcoal);
      ringSouth.rotation.x = -Math.PI / 2;
      ringSouth.position.set(0, 0.04, 26);
      roadGroup.add(ringSouth);

      const ringWest = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 64), matCharcoal);
      ringWest.rotation.x = -Math.PI / 2;
      ringWest.position.set(-26, 0.04, 0);
      roadGroup.add(ringWest);

      const ringEast = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 64), matCharcoal);
      ringEast.rotation.x = -Math.PI / 2;
      ringEast.position.set(26, 0.04, 0);
      roadGroup.add(ringEast);

      // Dashed Lane Markings
      for (let x = -30; x <= 30; x += 3.5) {
        if (Math.abs(x) > 3.5) {
          const dash = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.22), matWhiteMarking);
          dash.rotation.x = -Math.PI / 2;
          dash.position.set(x, 0.05, 0);
          roadGroup.add(dash);
        }
      }

      for (let z = -30; z <= 30; z += 3.5) {
        if (Math.abs(z) > 3.5) {
          const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 1.8), matWhiteMarking);
          dash.rotation.x = -Math.PI / 2;
          dash.position.set(0, 0.05, z);
          roadGroup.add(dash);
        }
      }

      // Pedestrian Zebra Crossings
      const addZebraCrossing = (cx: number, cz: number, isHorizontal: boolean) => {
        for (let i = -1.8; i <= 1.8; i += 0.65) {
          const stripe = new THREE.Mesh(
            new THREE.PlaneGeometry(isHorizontal ? 2.8 : 0.35, isHorizontal ? 0.35 : 2.8),
            matWhiteMarking
          );
          stripe.rotation.x = -Math.PI / 2;
          stripe.position.set(
            cx + (isHorizontal ? 0 : i),
            0.052,
            cz + (isHorizontal ? i : 0)
          );
          roadGroup.add(stripe);
        }
      };

      addZebraCrossing(-4.2, 0, false);
      addZebraCrossing(4.2, 0, false);
      addZebraCrossing(0, -4.2, true);
      addZebraCrossing(0, 4.2, true);

      currentScene.add(roadGroup);

      // ==========================================
      // 7. LANDSCAPED COURTYARDS & PARKS
      // ==========================================
      const addLawn = (w: number, d: number, x: number, z: number) => {
        const lawn = new THREE.Mesh(new THREE.PlaneGeometry(w, d), matLawn);
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.set(x, 0.05, z);
        currentScene.add(lawn);
      };

      addLawn(18, 18, -13, -13);
      addLawn(18, 18, 13, -13);
      addLawn(18, 18, -13, 13);
      addLawn(18, 18, 13, 13);

      // ==========================================
      // 8. PRIMARY REGIONAL LANDMARK HOSPITAL
      // ==========================================
      const landmarkGroup = new THREE.Group();
      landmarkGroup.position.set(-11, 0.15, -11);

      // Main Central Wing
      const landmarkMain = new THREE.Mesh(new THREE.BoxGeometry(10, 7.5, 8), matIvory);
      landmarkMain.position.y = 3.75;
      landmarkGroup.add(landmarkMain);

      // Plinth and roof trim
      const landmarkPlinth = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.35, 8.4), matLandmarkTrim);
      landmarkPlinth.position.y = 0.175;
      landmarkGroup.add(landmarkPlinth);

      const landmarkRoofTrim = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.4, 8.2), matLandmarkTrim);
      landmarkRoofTrim.position.y = 7.6;
      landmarkGroup.add(landmarkRoofTrim);

      // West Emergency Wing
      const landmarkWest = new THREE.Mesh(new THREE.BoxGeometry(6, 4.8, 5.5), matIvory);
      landmarkWest.position.set(-6, 2.4, 0);
      landmarkGroup.add(landmarkWest);

      // East ICU Tower
      const landmarkEast = new THREE.Mesh(new THREE.BoxGeometry(5.5, 6.2, 5.5), matIvory);
      landmarkEast.position.set(0, 3.1, -5.5);
      landmarkGroup.add(landmarkEast);

      // Rooftop Helipad with Regional Medical Cross
      const helipadPad = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.35, 24), matLawn);
      helipadPad.position.set(0, 7.8, 0);
      landmarkGroup.add(helipadPad);

      const helipadRing = new THREE.Mesh(new THREE.RingGeometry(3.0, 3.4, 24), matWhiteMarking);
      helipadRing.rotation.x = -Math.PI / 2;
      helipadRing.position.set(0, 8.0, 0);
      landmarkGroup.add(helipadRing);

      // Helipad Red Cross / 'H'
      const hBar1 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.2), matVermilion);
      hBar1.rotation.x = -Math.PI / 2;
      hBar1.position.set(-0.8, 8.02, 0);
      landmarkGroup.add(hBar1);

      const hBar2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.2), matVermilion);
      hBar2.rotation.x = -Math.PI / 2;
      hBar2.position.set(0.8, 8.02, 0);
      landmarkGroup.add(hBar2);

      const hBarCross = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), matVermilion);
      hBarCross.rotation.x = -Math.PI / 2;
      hBarCross.position.set(0, 8.02, 0);
      landmarkGroup.add(hBarCross);

      // Ribbon windows
      for (let y = 1.8; y <= 6; y += 1.8) {
        const band = new THREE.Mesh(windowStripGeomH, matGlass);
        band.scale.set(8.5, 0.7, 1);
        band.position.set(0, y, 4.02);
        landmarkGroup.add(band);
      }

      currentScene.add(landmarkGroup);

      // ==========================================
      // 9. SECONDARY REGIONAL FACILITIES (HOSPITALS 2, 3, 4)
      // ==========================================
      // 2. Secondary Hospital North-East (e.g. Safdarjung / Lilavati / Manipal / King's College)
      createBuilding(9.5, 6.2, 8, 12, -12, matIvory, matDeepGreen);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 3), matDeepGreen);
      canopy.position.set(12, 1.8, -7);
      currentScene.add(canopy);

      // 3. Cardiac Hospital South-West (e.g. Max Saket / Hinduja / Narayana / Barts)
      createBuilding(8, 8.5, 7.5, -12, 12, matIvory, matChampagne);
      createBuilding(5.5, 4.5, 5, -17, 12, matIvory, matDeepGreen);

      // 4. Multi-Specialty Hospital South-East (e.g. Apollo / Tata Memorial / Fortis / UCLH)
      createBuilding(9, 6.5, 7.5, 13, 14, matIvory, matDeepGreen);

      // 5. 24/7 Verified Emergency Pharmacy & Diagnostic Lab
      createBuilding(5.5, 3.6, 5, 5.5, 6.5, matIvory, matDeepGreen);
      const pCross1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.45), matLawn);
      pCross1.position.set(5.5, 4.0, 6.5);
      currentScene.add(pCross1);
      const pCross2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 1.4), matLawn);
      pCross2.position.set(5.5, 4.0, 6.5);
      currentScene.add(pCross2);

      // 6. Multi-Level Parking Garage
      const garageGroup = new THREE.Group();
      garageGroup.position.set(15, 0.15, 6.5);
      const garageBase = new THREE.Mesh(new THREE.BoxGeometry(8, 3.2, 6.5), matCharcoal);
      garageBase.position.y = 1.6;
      garageGroup.add(garageBase);
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.4, 6.7), matChampagne);
      barrier.position.y = 3.3;
      garageGroup.add(barrier);
      for (let px = -2.8; px <= 2.8; px += 1.4) {
        const stall = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 2.2), matWhiteMarking);
        stall.rotation.x = -Math.PI / 2;
        stall.position.set(px, 3.42, 1.2);
        garageGroup.add(stall);
      }
      currentScene.add(garageGroup);

      // ==========================================
      // 10. CAMPUS TREES & LANDSCAPE FLORA
      // ==========================================
      const treeCoordinates = [
        [-5.5, -5.5], [-8, -5.5], [-16, -5.5], [-16, -16], [-5.5, -16],
        [5.5, -5.5], [7.5, -5.5], [18, -5.5], [18, -17],
        [-5.5, 5.5], [-8, 8], [-16, 5.5], [-8, 17],
        [5.5, 12], [8.5, 12], [18, 5.5], [18, 19]
      ];

      treeCoordinates.forEach(([tx, tz], i) => {
        addTree(tx, tz, 0.85 + (i % 3) * 0.15);
      });

      // ==========================================
      // 11. MOVING MINIATURE AMBULANCES
      // ==========================================
      const ambGroup = new THREE.Group();

      const createMiniAmbulance = () => {
        const amb = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 2.6), matIvory);
        body.position.y = 0.55;
        amb.add(body);

        const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.6), matGlass);
        win.position.set(0, 0.75, 0.7);
        amb.add(win);

        const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.22, 1.4), matVermilion);
        stripe.position.set(0, 0.55, -0.2);
        amb.add(stripe);

        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 8), matVermilion);
        beacon.position.set(0, 1.15, 0.1);
        amb.add(beacon);

        return amb;
      };

      const amb1 = createMiniAmbulance();
      amb1.position.set(-15, 0.05, 1.25);
      ambGroup.add(amb1);

      const amb2 = createMiniAmbulance();
      amb2.rotation.y = Math.PI / 2;
      amb2.position.set(-1.25, 0.05, 12);
      ambGroup.add(amb2);

      currentScene.add(ambGroup);

      // ==========================================
      // 12. DYNAMIC REGIONAL FACILITY MARKERS
      // ==========================================
      facilityInteractiveMeshes.current = [];

      const hospitalLocations: { hosp: Hospital; pos: [number, number, number] }[] = [
        { hosp: activeHospitals[0], pos: [-11, 8.8, -11] }, // Landmark
        { hosp: activeHospitals[1], pos: [12, 7.8, -11] },  // Secondary North-East
        { hosp: activeHospitals[2], pos: [-12, 10.0, 12] }, // South-West
        { hosp: activeHospitals[3], pos: [13, 8.0, 14] }   // South-East
      ];

      hospitalLocations.forEach(({ hosp, pos }) => {
        if (!hosp) return;
        const markerGroup = new THREE.Group();
        markerGroup.position.set(pos[0], pos[1], pos[2]);

        const isTrauma = hosp.category === 'Trauma Center Level 1';

        const badgeGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.35, 6);
        const badgeMat = new THREE.MeshStandardMaterial({
          color: isTrauma ? 0xB82819 : 0x163C32,
          roughness: 0.2,
          metalness: 0.3
        });
        const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
        badgeMesh.rotation.x = Math.PI / 2;
        markerGroup.add(badgeMesh);

        // White Medical Cross on Marker
        const c1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.08), matWhiteMarking);
        c1.position.z = 0.2;
        markerGroup.add(c1);

        const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 0.08), matWhiteMarking);
        c2.position.z = 0.2;
        markerGroup.add(c2);

        // Thin Champagne Indicator Line
        const stemGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 6);
        const stemMesh = new THREE.Mesh(stemGeom, matChampagne);
        stemMesh.position.y = -1.2;
        markerGroup.add(stemMesh);

        currentScene.add(markerGroup);
        facilityInteractiveMeshes.current.push({ mesh: badgeMesh, hosp });
      });

      // ==========================================
      // 13. MOUSE ORBIT, PAN & INTERACTIVE RAYCASTING
      // ==========================================
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      onMouseDown = (e: MouseEvent) => {
        isDragging.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      };

      onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };

        sphericalCoords.current.theta -= deltaX * 0.006;
        sphericalCoords.current.phi -= deltaY * 0.006;

        sphericalCoords.current.phi = THREE.MathUtils.clamp(
          sphericalCoords.current.phi,
          Math.PI / 7,
          Math.PI / 2.3
        );

        const { radius, theta, phi } = sphericalCoords.current;
        targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
        targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
      };

      onMouseUp = () => {
        isDragging.current = false;
      };

      onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1.08 : 0.92;
        handleZoom(factor);
      };

      onPointerHover = (e: MouseEvent) => {
        if (isDragging.current || !camera) return;
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const interactiveObjects = facilityInteractiveMeshes.current.map(f => f.mesh);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
          const hit = facilityInteractiveMeshes.current.find(f => f.mesh === intersects[0].object);
          if (hit) {
            setHoveredHosp(hit.hosp);
            container.style.cursor = 'pointer';
          }
        } else {
          setHoveredHosp(null);
          container.style.cursor = isDragging.current ? 'grabbing' : 'grab';
        }
      };

      onClickSelect = (e: MouseEvent) => {
        if (!camera) return;
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const interactiveObjects = facilityInteractiveMeshes.current.map(f => f.mesh);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
          const hit = facilityInteractiveMeshes.current.find(f => f.mesh === intersects[0].object);
          if (hit) {
            onSelectHospital(hit.hosp);
          }
        }
      };

      // Mobile Touch Handlers
      onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging.current = true;
          previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
          isDragging.current = false;
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          previousPinchDist.current = Math.hypot(dx, dy);
        }
      };

      onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDragging.current) {
          const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
          const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
          previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

          sphericalCoords.current.theta -= deltaX * 0.007;
          sphericalCoords.current.phi -= deltaY * 0.007;

          sphericalCoords.current.phi = THREE.MathUtils.clamp(
            sphericalCoords.current.phi,
            Math.PI / 7,
            Math.PI / 2.3
          );

          const { radius, theta, phi } = sphericalCoords.current;
          targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
          targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
          targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
        } else if (e.touches.length === 2 && previousPinchDist.current > 0) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const currentDist = Math.hypot(dx, dy);
          if (currentDist > 0) {
            const factor = previousPinchDist.current / currentDist;
            previousPinchDist.current = currentDist;
            handleZoom(factor);
          }
        }
      };

      onTouchEnd = () => {
        isDragging.current = false;
        previousPinchDist.current = 0;
      };

      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      container.addEventListener('wheel', onWheel, { passive: false });
      container.addEventListener('mousemove', onPointerHover);
      container.addEventListener('click', onClickSelect);

      onResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      observer = new IntersectionObserver((entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      observer.observe(container);

      // ==========================================
      // 14. OPTIMIZED ANIMATION & RENDER LOOP
      // ==========================================
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let lastTime = 0;
      const interval = 1000 / 24;

      const animate = (currentTime: number) => {
        animId = requestAnimationFrame(animate);

        if (document.hidden || !isVisibleRef.current || !renderer || !scene || !camera) return;
        const delta = currentTime - lastTime;
        if (delta < interval) return;
        lastTime = currentTime - (delta % interval);

        const time = currentTime * 0.001;

        if (!prefersReducedMotion) {
          amb1.position.x = ((time * 7) % 52) - 26;
          amb2.position.z = ((time * 6) % 52) - 26;
        }

        currentCameraPos.current.lerp(targetCameraPos.current, 0.07);
        currentLookAt.current.lerp(targetLookAt.current, 0.07);
        camera.position.copy(currentCameraPos.current);
        camera.lookAt(currentLookAt.current);

        // Project 3D hospital coordinates to 2D screen positions for floating HTML badges
        if (containerRef.current) {
          const cWidth = containerRef.current.clientWidth;
          const cHeight = containerRef.current.clientHeight;
          const projVec = new THREE.Vector3();

          HOSPITAL_LABEL_COORDS.forEach((coord, idx) => {
            const el = labelRefs.current[idx];
            if (!el) return;
            projVec.set(coord[0], coord[1], coord[2]);
            projVec.project(camera!);

            // Hide if behind camera or far outside view frustum
            if (projVec.z > 1.0 || projVec.x < -1.15 || projVec.x > 1.15 || projVec.y < -1.15 || projVec.y > 1.15) {
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              const sx = (projVec.x * 0.5 + 0.5) * cWidth;
              const sy = (-(projVec.y * 0.5) + 0.5) * cHeight;
              el.style.opacity = '1';
              el.style.pointerEvents = 'auto';
              el.style.transform = `translate3d(${Math.round(sx)}px, ${Math.round(sy)}px, 0) translate(-50%, -100%)`;
            }
          });
        }

        renderer.render(scene, camera);
      };

      startTimer = setTimeout(() => {
        animId = requestAnimationFrame(animate);
      }, 100);
    }, 150);

    return () => {
      destroyed = true;
      clearTimeout(initTimer);
      if (startTimer) clearTimeout(startTimer);
      if (onResize) window.removeEventListener('resize', onResize);
      if (onMouseDown && containerRef.current) containerRef.current.removeEventListener('mousedown', onMouseDown);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onMouseUp) window.removeEventListener('mouseup', onMouseUp);
      if (onTouchStart && containerRef.current) containerRef.current.removeEventListener('touchstart', onTouchStart);
      if (onTouchMove) window.removeEventListener('touchmove', onTouchMove);
      if (onTouchEnd) window.removeEventListener('touchend', onTouchEnd);
      if (onWheel && containerRef.current) containerRef.current.removeEventListener('wheel', onWheel);
      if (onPointerHover && containerRef.current) containerRef.current.removeEventListener('mousemove', onPointerHover);
      if (onClickSelect && containerRef.current) containerRef.current.removeEventListener('click', onClickSelect);
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (scene) scene.clear();
    };
  }, [viewMode, onSelectHospital, regionId, activeHospitals]);

  return (
    <div className="relative w-full rounded-3xl bg-[#FAF8F5] border-2 border-[#C7AE7B]/35 overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Top Architectural Header Bar */}
      <div className="p-4 border-b border-[#C7AE7B]/25 flex items-center justify-between bg-white/95 backdrop-blur-md z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center text-[#C7AE7B] shadow-xs">
            <Building2 className="w-4 h-4 text-[#C7AE7B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-black tracking-wide uppercase font-mono text-[#163C32]">
                Spatial Medical City 3D · {currentLocation?.locationName.replace(/GPS:\s*/i, '').split(',')[0].split('(')[0].trim() || 'Regional Hub'}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#163C32] text-[#F4F0E6] font-bold border border-[#C7AE7B]/30">
                Active Campus
              </span>
            </div>
            <p className="text-[11px] text-[#163C32]/80 font-medium">
              Miniature regional campus · {activeHospitals[0]?.name || 'Apex Trauma Center'} & surrounding facilities
            </p>
          </div>
        </div>

        {/* 3-Mode View Switcher (3D City / Real Google Satellite Map / 2D Grid) */}
        <div className="flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#C7AE7B]/30 shadow-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === '3d'
                ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
                : 'text-[#163C32] hover:bg-white'
            }`}
            title="Interactive 3D Miniature Medical Campus with Live Labels"
          >
            <Building2 className="w-3.5 h-3.5 text-[#C7AE7B]" />
            <span>3D City</span>
          </button>
          <button
            onClick={() => setViewMode('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'satellite'
                ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
                : 'text-[#163C32] hover:bg-white'
            }`}
            title="Real Google Satellite Map with Highways, Roads & Buildings"
          >
            <Globe className="w-3.5 h-3.5 text-[#C7AE7B]" />
            <span>Satellite Map</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === '2d'
                ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
                : 'text-[#163C32] hover:bg-white'
            }`}
            title="2D Emergency Grid Card View"
          >
            <Layers className="w-3.5 h-3.5 text-[#C7AE7B]" />
            <span>2D Grid</span>
          </button>
        </div>
      </div>

      {/* VIEW MODES: 1. 3D WebGL Diorama, 2. Google Satellite Map, 3. 2D Schematic Grid */}
      {viewMode === '3d' ? (
        <div
          ref={containerRef}
          className="relative w-full h-[420px] sm:h-[480px] bg-[#F4F0E6] select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden"
          role="region"
          aria-label="3D Interactive Medical City View"
        >
          {/* Active SOS Red Border Pulse */}
          {sosActive && (
            <div className="absolute inset-0 border-4 border-[#B82819] animate-pulse pointer-events-none rounded-3xl z-20" />
          )}

          {/* 3D Screen-Projected Floating Hospital Badges Directly Above Buildings */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {activeHospitals.slice(0, 4).map((hosp, idx) => {
              const isSelected = selectedHospital?.id === hosp.id;
              const isTrauma = hosp.category === 'Trauma Center Level 1';
              return (
                <div
                  key={hosp.id}
                  ref={(el) => { labelRefs.current[idx] = el; }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHospital(hosp);
                  }}
                  className={`pointer-events-auto absolute top-0 left-0 cursor-pointer transition-all duration-150 select-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-xl font-mono text-[11px] font-bold border backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#163C32] text-[#F4F0E6] border-[#C7AE7B] ring-2 ring-[#B82819] shadow-2xl scale-110 z-30'
                      : 'bg-white/95 text-[#163C32] border-[#C7AE7B]/40 hover:bg-[#F4F0E6] hover:scale-105 z-20 hover:border-[#163C32]'
                  }`}
                  style={{ willChange: 'transform, opacity', opacity: 0 }}
                  title={`Click to focus ${hosp.name}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isTrauma ? 'bg-[#B82819] animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-extrabold tracking-tight max-w-[120px] sm:max-w-[160px] truncate">
                    {hosp.name}
                  </span>
                  <span className="text-[10px] opacity-75 font-normal">
                    · {hosp.icuBedsAvailable} ICU
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Navigation Controls */}
          <div className="absolute left-4 bottom-4 z-20 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C7AE7B]/40 shadow-xl">
            <button
              onClick={() => handleZoom(0.85)}
              className="p-2 rounded-xl text-[#163C32] hover:bg-[#F4F0E6] transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1.18)}
              className="p-2 rounded-xl text-[#163C32] hover:bg-[#F4F0E6] transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2 rounded-xl text-[#163C32] hover:bg-[#F4F0E6] transition-colors"
              title="Reset View to City Overview"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#C7AE7B]/30 mx-1" />
            <button
              onClick={() => onSelectHospital(activeHospitals[0])}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1 ${
                selectedHospital?.id === activeHospitals[0]?.id
                  ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
                  : 'text-[#163C32] hover:bg-[#F4F0E6]'
              }`}
              title={`Focus ${activeHospitals[0]?.name}`}
            >
              <Crosshair className="w-3.5 h-3.5 text-[#B82819]" />
              <span className="truncate max-w-[85px]">{activeHospitals[0]?.name.split(' ')[0]}</span>
            </button>
          </div>

          {/* Floating Key / Legend */}
          <div className="absolute right-4 bottom-4 z-20 hidden sm:flex flex-col space-y-1.5 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C7AE7B]/40 text-[11px] font-mono shadow-xl text-[#163C32]">
            <div className="text-[10px] text-[#7A5E2E] font-black uppercase tracking-wider mb-0.5">
              Campus Legend
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#B82819] rounded-xs flex items-center justify-center text-white text-[8px] font-black">
                +
              </div>
              <span className="font-medium">Level 1 Trauma Center</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#163C32] rounded-full" />
              <span className="font-medium">General / Cardiac Hospital</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#3E7B62] rounded-full" />
              <span className="font-medium">Healing Parks & Courtyards</span>
            </div>
          </div>

          {/* Hover Tooltip */}
          {hoveredHosp && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none p-3 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#C7AE7B] shadow-2xl text-left min-w-[210px] animate-in fade-in duration-150">
              <div className="text-[10px] font-mono uppercase font-black text-[#7A5E2E]">
                {hoveredHosp.category}
              </div>
              <h4 className="text-xs font-black text-[#163C32] mt-0.5">{hoveredHosp.name}</h4>
              <p className="text-[10px] text-[#163C32]/85 font-mono mt-1 font-medium">
                {hoveredHosp.icuBedsAvailable} ICU Beds Available · Click to inspect
              </p>
            </div>
          )}
        </div>
      ) : viewMode === 'satellite' ? (
        /* Real Google Satellite Hybrid Map Mode */
        <div className="w-full h-[420px] sm:h-[480px] relative">
          <SatelliteMapView
            currentLocation={currentLocation || {
              lat: 28.5672,
              lng: 77.2100,
              locationName: 'AIIMS Trauma Center, New Delhi',
              regionId: 'delhi',
              accuracyMeters: 10,
              source: 'manual',
              lastUpdated: new Date().toISOString(),
              isStale: false
            }}
            hospitals={activeHospitals}
            selectedHospital={selectedHospital}
            onSelectHospital={onSelectHospital}
          />
        </div>
      ) : (
        /* 2D Schematic Plan Fallback */
        <div className="p-6 bg-[#FAF8F5] min-h-[440px] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#C7AE7B]/25">
              <h4 className="text-sm font-black text-[#163C32]">
                2D Emergency Grid · {currentLocation?.locationName || 'Active Region'}
              </h4>
              <span className="text-xs font-mono text-[#7A5E2E] font-bold">
                {activeHospitals.length} Verified Facilities Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeHospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => onSelectHospital(hosp)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border-2 shadow-xs ${
                      isSelected
                        ? 'bg-white border-[#163C32] shadow-md ring-2 ring-[#C7AE7B]/40'
                        : 'bg-white border-[#C7AE7B]/30 hover:border-[#163C32]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase">
                        {hosp.category}
                      </span>
                      <span className="text-xs font-mono font-black text-[#B82819]">
                        {hosp.erWaitTime}
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-[#163C32] mt-1">{hosp.name}</h5>
                    <p className="text-[11px] text-[#163C32]/80 mt-0.5 line-clamp-1 font-medium">{hosp.address}</p>
                    <p className="text-[10px] font-mono text-[#7A5E2E] mt-1 font-semibold">
                      {hosp.distance} · {hosp.driveTime} drive · {hosp.icuBedsAvailable} ICU beds
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Hospital Quick Action Footer */}
      {selectedHospital && (
        <div className="p-4 bg-white border-t border-[#C7AE7B]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center text-[#F4F0E6] shrink-0 font-black text-xs shadow-xs">
              {selectedHospital.category === 'Trauma Center Level 1' ? 'L1' : 'ER'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#163C32]">{selectedHospital.name}</span>
                <span className="text-[10px] font-mono text-[#7A5E2E] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C7AE7B]/35 font-bold">
                  {selectedHospital.category}
                </span>
              </div>
              <p className="text-[11px] text-[#163C32]/85 font-medium mt-0.5">
                {selectedHospital.address} · {selectedHospital.icuBedsAvailable} ICU beds free
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={`tel:${selectedHospital.phone.replace(/[^0-9+]/g, '')}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Direct</span>
            </a>
            <button
              onClick={handleResetCamera}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EDE9DE] border border-[#C7AE7B]/40 text-xs font-bold text-[#163C32] transition-colors shadow-xs flex items-center gap-1"
              title="Return to City Overview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>City View</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
