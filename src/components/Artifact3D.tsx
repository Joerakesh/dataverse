"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  themeId: string;
  primaryColor: string;
  accentColor: string;
};

function makeStarGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 0.48 : 0.21;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.025, bevelThickness: 0.025 });
}

function makeCore(themeId: string, color: THREE.Color) {
  const material = new THREE.MeshPhysicalMaterial({
    color: themeId === "cap" ? "#153b8a" : color,
    emissive: color,
    emissiveIntensity: 0.85,
    metalness: 0.72,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });

  if (themeId === "ironman") {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.58);
    shape.lineTo(0.52, -0.38);
    shape.lineTo(-0.52, -0.38);
    shape.closePath();
    return new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.055, bevelThickness: 0.055 }), material);
  }
  if (themeId === "cap") {
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.14, 64), material);
    shield.rotation.x = Math.PI / 2;
    return shield;
  }
  if (themeId === "strange") return new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 1), material);
  if (themeId === "hulk") return new THREE.Mesh(new THREE.DodecahedronGeometry(0.58, 1), material);
  if (themeId === "spidey") return new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 1), material);
  if (themeId === "rocket") return new THREE.Mesh(new THREE.TorusKnotGeometry(0.34, 0.13, 96, 12, 2, 5), material);
  return new THREE.Mesh(new THREE.IcosahedronGeometry(0.56, 1), material);
}

export default function Artifact3D({ themeId, primaryColor, accentColor }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 4.6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth || 420, host.clientHeight || 420);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const primary = new THREE.Color(primaryColor);
    const accent = new THREE.Color(accentColor);
    scene.add(new THREE.AmbientLight("#ffffff", 1.2));
    const keyLight = new THREE.PointLight(primary, 16, 10);
    keyLight.position.set(2, 2, 3);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(accent, 9, 8);
    rimLight.position.set(-2, -1, -2);
    scene.add(rimLight);

    const rig = new THREE.Group();
    scene.add(rig);

    const core = makeCore(themeId, primary);
    rig.add(core);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: primary,
      emissive: primary,
      emissiveIntensity: 1.1,
      metalness: 0.7,
      roughness: 0.24,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.8,
      metalness: 0.75,
      roughness: 0.3,
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.025, 12, 120), ringMaterial);
    outerRing.rotation.x = 0.28;
    rig.add(outerRing);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.018, 10, 100), accentMaterial);
    innerRing.rotation.y = Math.PI / 2.7;
    rig.add(innerRing);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.008, 8, 128),
      new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.5 })
    );
    halo.rotation.x = Math.PI / 2.4;
    rig.add(halo);

    if (themeId === "cap") {
      const star = new THREE.Mesh(makeStarGeometry(), new THREE.MeshStandardMaterial({ color: "#e8f3ff", metalness: 0.8, roughness: 0.2, emissive: "#6aa8ff", emissiveIntensity: 0.35 }));
      star.position.z = 0.1;
      rig.add(star);
    }

    if (themeId === "spidey") {
      const webMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.7 });
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(angle) * 1.02, Math.sin(angle) * 1.02, 0)];
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), webMaterial);
        rig.add(line);
      }
    }

    const satellites = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? 0.045 : 0.025, 12, 12), i % 3 === 0 ? accentMaterial : ringMaterial);
      bead.position.set(Math.cos(angle) * 1.28, Math.sin(angle) * 1.28, 0);
      satellites.add(bead);
    }
    rig.add(satellites);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resizeObserver = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    });
    resizeObserver.observe(host);

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      if (!reducedMotion) {
        rig.rotation.y += 0.0045;
        rig.rotation.x = Math.sin(frame * 0.004) * 0.08;
        outerRing.rotation.z -= 0.006;
        innerRing.rotation.x += 0.009;
        halo.rotation.z += 0.003;
        satellites.rotation.z -= 0.008;
        core.rotation.y += 0.007;
        core.rotation.x += 0.003;
        keyLight.intensity = 14 + Math.sin(frame * 0.035) * 2;
      }
      frame++;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [themeId, primaryColor, accentColor]);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-[1]" />;
}
