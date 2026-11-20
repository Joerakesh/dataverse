import * as THREE from 'three';

export type HeroThemeId =
  | 'thor'
  | 'captain'
  | 'hulk'
  | 'strange'
  | 'groot'
  | 'antman-spidey'
  | 'doom'
  | 'iron-man'
  | 'rocket';

/** Maps a DATAVERSE event character alias to the 3D model / VFX theme. */
export function heroThemeForAlias(alias: string): HeroThemeId {
  const a = alias.toLowerCase();
  if (a.includes('thor')) return 'thor';
  if (a.includes('captain')) return 'captain';
  if (a.includes('hulk')) return 'hulk';
  if (a.includes('strange')) return 'strange';
  if (a.includes('groot')) return 'groot';
  if (a.includes('spider') || a.includes('ant-man')) return 'antman-spidey';
  if (a.includes('iron')) return 'iron-man';
  if (a.includes('rocket')) return 'rocket';
  return 'doom';
}

export function isSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createHeroModel(theme: HeroThemeId): THREE.Group {
  switch (theme) {
    case 'thor':
      return createThorModel();
    case 'captain':
      return createCaptainModel();
    case 'hulk':
      return createHulkModel();
    case 'strange':
      return createStrangeModel();
    case 'groot':
      return createGrootModel();
    case 'antman-spidey':
      return createSpiderAntModel();
    case 'iron-man':
      return createIronManModel();
    case 'rocket':
      return createRocketModel();
    case 'doom':
    default:
      return createDoomModel();
  }
}

/* 1. DOCTOR DOOM 3D METALLIC MASK & HOOD */
function createDoomModel(): THREE.Group {
  const group = new THREE.Group();

  const hoodMat = new THREE.MeshStandardMaterial({
    color: 0x0a2918,
    roughness: 0.78,
    metalness: 0.12,
  });
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x9fb0aa,
    roughness: 0.24,
    metalness: 0.92,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x26312d,
    roughness: 0.42,
    metalness: 0.85,
  });
  const eyeGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ff66,
    emissive: 0x00ff66,
    emissiveIntensity: 2.4,
    roughness: 0.1,
  });

  // Outer Hood Shell
  const hood = new THREE.Mesh(new THREE.ConeGeometry(1.38, 2.55, 8, 1, true), hoodMat);
  hood.position.set(0, 0.15, -0.18);
  hood.scale.set(1.05, 1, 0.85);
  group.add(hood);

  // Inner Hood Shadow Backing
  const innerBacking = new THREE.Mesh(
    new THREE.SphereGeometry(0.96, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x030604, roughness: 0.95 })
  );
  innerBacking.scale.set(0.95, 1.18, 0.75);
  innerBacking.position.set(0, -0.05, -0.15);
  group.add(innerBacking);

  // Titanium Faceplate
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.56, 1.55, 6), titaniumMat);
  face.position.set(0, -0.08, 0.18);
  face.scale.set(1.02, 1, 0.65);
  group.add(face);

  // Brow Armor Plate
  const brow = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.24, 0.52), darkMetalMat);
  brow.position.set(0, 0.28, 0.42);
  brow.rotation.x = 0.14;
  group.add(brow);

  // Glowing Emerald Eye Slits
  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.1), eyeGlowMat);
  leftEye.position.set(-0.27, 0.08, 0.64);
  leftEye.rotation.z = -0.16;
  group.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.1), eyeGlowMat);
  rightEye.position.set(0.27, 0.08, 0.64);
  rightEye.rotation.z = 0.16;
  group.add(rightEye);

  // Mouth Grille Frame + Vertical Slats
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.36, 0.22), darkMetalMat);
  grille.position.set(0, -0.45, 0.52);
  group.add(grille);

  for (let i = -2; i <= 2; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.3, 0.26), titaniumMat);
    slat.position.set(i * 0.12, -0.45, 0.53);
    group.add(slat);
  }

  // Mystic Emerald Ring Halo Behind Hood
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.028, 12, 48),
    new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 1.8,
    })
  );
  halo.position.set(0, 0, -0.45);
  group.add(halo);

  return group;
}

/* 2. THOR 3D MJOLNIR */
function createThorModel(): THREE.Group {
  const group = new THREE.Group();

  const uruMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.22,
    metalness: 0.94,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.35,
    metalness: 0.88,
  });
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x6b3a19,
    roughness: 0.82,
    metalness: 0.08,
  });
  const lightningMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.2,
  });

  // Main Hammer Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.92, 0.96), uruMat);
  head.position.set(0, 0.65, 0);
  group.add(head);

  // Beveled End Caps
  const leftCap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.16, 4), trimMat);
  leftCap.rotation.z = Math.PI / 2;
  leftCap.rotation.x = Math.PI / 4;
  leftCap.position.set(-0.95, 0.65, 0);
  group.add(leftCap);

  const rightCap = leftCap.clone();
  rightCap.position.set(0.95, 0.65, 0);
  rightCap.rotation.z = -Math.PI / 2;
  group.add(rightCap);

  // Handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 1.55, 16), leatherMat);
  handle.position.set(0, -0.55, 0);
  group.add(handle);

  // Pommel
  const pommel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.22, 16), uruMat);
  pommel.position.set(0, -1.36, 0);
  group.add(pommel);

  // Electric Lightning Rings
  const arc1 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.024, 10, 42), lightningMat);
  arc1.position.set(0, 0.65, 0);
  arc1.rotation.set(0.6, 0.4, 0);
  group.add(arc1);

  const arc2 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.02, 10, 42), lightningMat);
  arc2.position.set(0, 0.65, 0);
  arc2.rotation.set(-0.5, 0.9, 0.3);
  group.add(arc2);

  group.rotation.z = -0.18;
  return group;
}

/* 3. CAPTAIN AMERICA 3D VIBRANIUM SHIELD */
function createCaptainModel(): THREE.Group {
  const group = new THREE.Group();

  const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.22, metalness: 0.86 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.18, metalness: 0.95 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.24, metalness: 0.85 });

  // Outer Red Ring
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.14, 48), redMat);
  outer.rotation.x = Math.PI / 2;
  group.add(outer);

  // Silver Ring
  const silver = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.18, 48), silverMat);
  silver.rotation.x = Math.PI / 2;
  silver.position.z = 0.02;
  group.add(silver);

  // Inner Red Ring
  const innerRed = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.22, 48), redMat);
  innerRed.rotation.x = Math.PI / 2;
  innerRed.position.z = 0.04;
  group.add(innerRed);

  // Blue Center Disc
  const centerBlue = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.26, 48), blueMat);
  centerBlue.rotation.x = Math.PI / 2;
  centerBlue.position.z = 0.06;
  group.add(centerBlue);

  // 3D Star Emblem
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.44 : 0.19;
    const angle = (i * Math.PI) / 5 + Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
  const star = new THREE.Mesh(starGeo, silverMat);
  star.position.z = 0.18;
  group.add(star);

  return group;
}

/* 4. HULK 3D GAMMA FIST */
function createHulkModel(): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.58,
    metalness: 0.08,
  });
  const darkSkinMat = new THREE.MeshStandardMaterial({
    color: 0x14532d,
    roughness: 0.68,
    metalness: 0.05,
  });
  const gammaGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ff66,
    emissive: 0x00ff66,
    emissiveIntensity: 2.0,
  });

  // Palm / Main Fist Block
  const palm = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.25, 0.95), skinMat);
  group.add(palm);

  // 4 Articulated Knuckles / Fingers
  for (let i = 0; i < 4; i++) {
    const knuckle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 0.56), skinMat);
    knuckle.position.set(-0.51 + i * 0.34, 0.62, 0.25);
    knuckle.rotation.x = 0.35;
    group.add(knuckle);
  }

  // Thumb
  const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.38, 0.44), darkSkinMat);
  thumb.position.set(-0.22, -0.18, 0.58);
  thumb.rotation.z = 0.18;
  group.add(thumb);

  // Forearm
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.66, 0.85, 12), darkSkinMat);
  wrist.position.set(0, -1.0, -0.05);
  group.add(wrist);

  // Gamma Shockwave Ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.035, 10, 40), gammaGlowMat);
  ring.rotation.x = Math.PI / 2.2;
  ring.position.y = -0.3;
  group.add(ring);

  return group;
}

/* 5. DOCTOR STRANGE 3D ELDRITCH MANDALA */
function createStrangeModel(): THREE.Group {
  const group = new THREE.Group();

  const goldGlow = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });
  const amberGlow = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    emissive: 0xea580c,
    emissiveIntensity: 1.8,
    roughness: 0.25,
  });

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.04, 12, 64), goldGlow);
  group.add(outerRing);

  const midRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.03, 12, 48), amberGlow);
  group.add(midRing);

  const innerSquare1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.028, 8, 4), goldGlow);
  group.add(innerSquare1);

  const innerSquare2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.028, 8, 4), amberGlow);
  innerSquare2.rotation.z = Math.PI / 4;
  group.add(innerSquare2);

  // Floating Eye of Agamotto Core
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 2.5,
      metalness: 0.4,
      roughness: 0.1,
    })
  );
  group.add(core);

  return group;
}

/* 6. GROOT 3D BARK HEAD & GLOWING ROOTS */
function createGrootModel(): THREE.Group {
  const group = new THREE.Group();

  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x5c4033,
    roughness: 0.9,
    metalness: 0.04,
  });
  const mossMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x00ff66,
    emissiveIntensity: 1.2,
    roughness: 0.5,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.1,
    metalness: 0.8,
  });

  // Main Wooden Head Trunk
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.52, 1.35, 9), barkMat);
  group.add(head);

  // Crown Branch Spikes
  const spikeAngles = [-0.5, -0.25, 0, 0.25, 0.5];
  spikeAngles.forEach((a, idx) => {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.55 + (idx % 2) * 0.22, 6),
      barkMat
    );
    spike.position.set(Math.sin(a) * 0.52, 0.82, Math.cos(a) * 0.2 - 0.1);
    spike.rotation.z = -a * 0.6;
    group.add(spike);
  });

  // Eyes
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), eyeMat);
  leftEye.position.set(-0.26, 0.08, 0.56);
  group.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.set(0.26, 0.08, 0.56);
  group.add(rightEye);

  // Glowing Organic Root Tendrils
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + 0.4;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 0.4, -0.5, Math.sin(angle) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 0.95, -0.1, Math.sin(angle) * 0.95),
      new THREE.Vector3(Math.cos(angle + 0.5) * 1.25, 0.45, Math.sin(angle + 0.5) * 1.25),
    ]);
    const vine = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.035, 8, false), mossMat);
    group.add(vine);
  }

  return group;
}

/* 7. SPIDER-MAN 3D MASK + ANT-MAN QUANTUM RINGS + 3D SPIDER WEBS */
function createSpiderAntModel(): THREE.Group {
  const group = new THREE.Group();

  const suitRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.34,
    metalness: 0.35,
  });
  const lensRimMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.3,
    metalness: 0.6,
  });
  const lensWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0xe2e8f0,
    emissiveIntensity: 0.6,
    roughness: 0.15,
  });
  const webMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x00ff66,
    emissiveIntensity: 1.1,
    roughness: 0.2,
  });

  // Spider-Man Head Sphere
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.76, 24, 24), suitRedMat);
  head.scale.set(0.92, 1.12, 0.96);
  group.add(head);

  // Expressive Spider-Man Lenses (Left & Right)
  const makeLens = (side: -1 | 1) => {
    const lensGroup = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.1), lensRimMat);
    const white = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.12), lensWhiteMat);
    lensGroup.add(rim, white);
    lensGroup.position.set(side * 0.28, 0.08, 0.66);
    lensGroup.rotation.z = side * 0.28;
    lensGroup.rotation.y = side * 0.22;
    return lensGroup;
  };
  group.add(makeLens(-1), makeLens(1));

  // Ant-Man Quantum Pym Ring
  const pymRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.025, 10, 48),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.9,
    })
  );
  pymRing.rotation.set(1.1, 0.35, 0);
  group.add(pymRing);

  // 3D Radiating Spider Web Strands
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.7, 6), webMat);
    strand.rotation.z = angle;
    strand.position.z = -0.35;
    group.add(strand);
  }
  const webRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.016, 8, 6), webMat);
  webRing.position.z = -0.35;
  group.add(webRing);

  return group;
}


/* 8. IRON MAN HELMET + ARC REACTOR */
function createIronManModel(): THREE.Group {
  const group = new THREE.Group();

  const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.2, metalness: 0.92 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5b82e, roughness: 0.22, metalness: 0.95 });
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x7df9ff,
    emissive: 0x38e8ff,
    emissiveIntensity: 2.6,
    roughness: 0.1,
  });

  // Helmet dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.92, 28, 28), redMat);
  dome.scale.set(0.92, 1.08, 0.98);
  dome.position.set(0, 0.15, 0);
  group.add(dome);

  // Gold faceplate
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.4, 1.2, 6), goldMat);
  face.position.set(0, -0.1, 0.42);
  face.scale.set(1, 1, 0.55);
  group.add(face);

  // Glowing eye slits
  for (const side of [-1, 1] as const) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.08), glowMat);
    eye.position.set(side * 0.24, 0.1, 0.72);
    eye.rotation.z = side * -0.14;
    group.add(eye);
  }

  // Mouth slit
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.06), new THREE.MeshStandardMaterial({ color: 0x3b2a08, roughness: 0.5, metalness: 0.7 }));
  mouth.position.set(0, -0.42, 0.72);
  group.add(mouth);

  // Arc reactor ring behind the helmet
  const reactor = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 14, 56), glowMat);
  reactor.position.set(0, 0.1, -0.5);
  group.add(reactor);
  const reactorInner = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.025, 10, 40), glowMat);
  reactorInner.position.set(0, 0.1, -0.5);
  group.add(reactorInner);

  return group;
}

/* 9. ROCKET'S BLASTER */
function createRocketModel(): THREE.Group {
  const group = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.9 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.6 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.45, metalness: 0.8 });
  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    emissive: 0xf97316,
    emissiveIntensity: 2.4,
    roughness: 0.15,
  });

  // Barrel
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 2.2, 18), steelMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.2, 0.25, 0);
  group.add(barrel);

  // Muzzle ring + plasma core
  const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.06, 12, 24), orangeMat);
  muzzle.rotation.y = Math.PI / 2;
  muzzle.position.set(1.3, 0.25, 0);
  group.add(muzzle);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), plasmaMat);
  core.position.set(1.3, 0.25, 0);
  group.add(core);

  // Body / receiver
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.5), orangeMat);
  body.position.set(-0.55, 0.15, 0);
  group.add(body);

  // Grip
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.9, 0.34), darkMat);
  grip.position.set(-0.6, -0.55, 0);
  grip.rotation.z = 0.18;
  group.add(grip);

  // Energy halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.025, 10, 48), plasmaMat);
  halo.position.set(0.1, 0.1, -0.4);
  group.add(halo);

  group.rotation.z = 0.12;
  return group;
}
