"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createHeroModel, isSoftwareWebGL, type HeroThemeId } from '@/src/three/heroModels';

interface HeroCharacter3DProps {
  theme: HeroThemeId;
  className?: string;
  mode?: 'hero' | 'transition';
  /** Called if WebGL can't be created so the parent can show a fallback. */
  onError?: () => void;
}

export function HeroCharacter3D({
  theme,
  className = 'w-64 h-72',
  mode = 'hero',
  onError,
}: HeroCharacter3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const softwareGl = isSoftwareWebGL();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, mode === 'transition' ? 4.8 : 4.3);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !softwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onErrorRef.current?.();
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    // Studio 3-point + warm/cool rig
    const hemi = new THREE.HemisphereLight(0xb8ffe0, 0x050806, 0.9);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff5e4, 2.0);
    key.position.set(3.5, 4.5, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x00ff66, 1.8);
    rim.position.set(-4, 2, -3.5);
    scene.add(rim);

    const model = createHeroModel(theme);
    scene.add(model);

    if (!softwareGl) {
      renderer.compile(scene, camera);
    }

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (mode !== 'hero') return;
      pointerX = (e.clientX / window.innerWidth - 0.5) * 0.7;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (mode === 'hero') {
        model.rotation.y = THREE.MathUtils.damp(
          model.rotation.y,
          Math.sin(elapsed * 0.7) * 0.28 + pointerX,
          4.5,
          dt
        );
        model.rotation.x = THREE.MathUtils.damp(model.rotation.x, pointerY * 0.5, 4.5, dt);
        model.position.y = Math.sin(elapsed * 1.4) * 0.1;
      } else {
        // Dynamic 3D transition spin & surge
        const progress = Math.min(elapsed / 1.15, 1);
        if (theme === 'thor') {
          model.position.y = -3.2 + progress * 6.8;
          model.rotation.y = elapsed * 8;
        } else if (theme === 'captain') {
          model.rotation.z = elapsed * 10;
          model.rotation.y = Math.sin(elapsed * 6) * 0.5;
          const s = 0.4 + Math.sin(progress * Math.PI) * 1.25;
          model.scale.setScalar(s);
        } else if (theme === 'hulk') {
          const s = 0.5 + Math.sin(progress * Math.PI) * 1.45;
          model.scale.setScalar(s);
          model.rotation.z = Math.sin(elapsed * 22) * 0.12;
        } else if (theme === 'strange') {
          model.rotation.z = elapsed * 4.5;
          model.rotation.y = elapsed * 1.8;
          model.scale.setScalar(0.35 + progress * 1.35);
        } else if (theme === 'groot') {
          model.rotation.y = Math.sin(elapsed * 3) * 0.6;
          model.scale.setScalar(0.75 + Math.sin(progress * Math.PI) * 0.65);
        } else if (theme === 'antman-spidey') {
          // Quantum shrink -> expand
          const quantumScale = progress < 0.35 ? 1.4 - progress * 3.5 : 0.18 + (progress - 0.35) * 2.1;
          model.scale.setScalar(Math.max(0.08, quantumScale));
          model.rotation.y = elapsed * 5.2;
        } else if (theme === 'iron-man') {
          // Repulsor drop-in with a spin
          model.position.y = 2.6 - Math.min(progress * 2.2, 1) * 2.6;
          model.rotation.y = Math.sin(elapsed * 4) * 0.5 + elapsed * 1.2;
          model.scale.setScalar(0.8 + Math.sin(progress * Math.PI) * 0.5);
        } else if (theme === 'rocket') {
          // Blaster recoil + spin
          model.rotation.y = elapsed * 5;
          model.rotation.z = Math.sin(elapsed * 14) * 0.08 + 0.12;
          model.scale.setScalar(0.6 + Math.sin(progress * Math.PI) * 0.9);
        } else {
          // Doom override lock-in
          model.rotation.y = Math.sin(elapsed * 2.5) * 0.4;
          model.scale.setScalar(1.3 - Math.abs(progress - 0.5) * 0.6);
        }
      }

      renderer.render(scene, camera);

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      model.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envTex.dispose();
      renderer.dispose();
    };
  }, [theme, mode]);

  return <div ref={mountRef} className={`relative select-none ${className}`} />;
}
