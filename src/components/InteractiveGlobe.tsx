import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Project } from '../types';
import { sound } from '../utils/audio';

interface InteractiveGlobeProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  height?: string;
  autoRotate?: boolean;
}

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  projects,
  onSelectProject,
  height = '580px',
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const h = container.clientHeight || 580;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / h, 0.1, 1000);
    camera.position.z = 260;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const cardMeshes: { mesh: THREE.Mesh; project: Project; baseScale: number }[] = [];

    // Calculate spherical distribution for project cards
    const radius = 100;
    const cardWidth = 42;
    const cardHeight = 30;
    const total = projects.length;

    projects.forEach((proj, i) => {
      // Golden spiral distribution
      const phi = Math.acos(-1 + (2 * i + 1) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      // Load texture with fallback
      const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const texture = textureLoader.load(proj.image);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      // Make card face outward from sphere center
      mesh.lookAt(x * 2, y * 2, z * 2);

      mesh.userData = { project: proj };
      globeGroup.add(mesh);
      cardMeshes.push({ mesh, project: proj, baseScale: 1 });
    });

    // Inertia & drag interaction variables
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotVelX = 0;
    let rotVelY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      rotVelX = 0;
      rotVelY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      // Raycasting for hover
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(globeGroup.children);

      if (intersects.length > 0) {
        const found = intersects[0].object.userData.project as Project;
        setHoveredProject(found);
      } else {
        setHoveredProject(null);
      }

      if (!isPointerDown) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      rotVelY = deltaX * 0.005;
      rotVelX = deltaY * 0.005;
      targetRotY += rotVelY;
      targetRotX += rotVelX;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setIsDragging(false);
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(globeGroup.children);

      if (intersects.length > 0) {
        const proj = intersects[0].object.userData.project as Project;
        sound.playClick();
        onSelectProject(proj);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('click', onClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPointerDown) {
        // Friction decay
        rotVelX *= 0.94;
        rotVelY *= 0.94;

        if (autoRotate) {
          globeGroup.rotation.y += 0.0028 + rotVelY;
          globeGroup.rotation.x += rotVelX;
        } else {
          globeGroup.rotation.y += rotVelY;
          globeGroup.rotation.x += rotVelX;
        }
      } else {
        globeGroup.rotation.y += rotVelY;
        globeGroup.rotation.x += rotVelX;
      }

      // Constrain vertical tilt to avoid flipping
      globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x));

      // Depth fading & scale on cards
      cardMeshes.forEach(({ mesh }) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        // Distance relative to camera
        const zDist = worldPos.z;
        const normalizedZ = (zDist + radius) / (radius * 2); // 0 to 1
        const scale = 0.8 + normalizedZ * 0.45;
        mesh.scale.set(scale, scale, scale);

        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.opacity = Math.max(0.2, Math.min(1.0, 0.3 + normalizedZ * 0.7));
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('click', onClick);
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [projects, autoRotate, onSelectProject]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-black/10 bg-black/[0.02]"
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating indicator/hover card */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isDragging ? 'ROTATING SPHERE' : 'DRAG TO ROTATE 3D GLOBE'}</span>
        </div>

        {hoveredProject && (
          <div className="hidden sm:flex items-center gap-2 bg-[var(--_colors---background--bg,#dfdfdf)] text-black px-4 py-1.5 rounded-full text-xs font-semibold border border-black/15 shadow-lg">
            <span>{hoveredProject.title}</span>
            <span className="opacity-50 text-[10px]">[{hoveredProject.category}]</span>
          </div>
        )}
      </div>
    </div>
  );
};
