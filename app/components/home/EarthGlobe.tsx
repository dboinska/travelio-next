"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import {
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  TextureLoader,
  type Mesh as MeshType,
  type Texture,
} from "three";
import type { GlobeArc, GlobePoint } from "@/lib/globe/types";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const CLOUDS_TEXTURE = "/textures/clouds.png";
const GLOBE_SCALE = 0.9;

const CLOUD_LAYERS = [
  { alt: 0.004, opacity: 0.16, displacement: 0, speed: -0.018 },
  { alt: 0.009, opacity: 0.24, displacement: 5.5, speed: -0.026 },
  { alt: 0.018, opacity: 0.1, displacement: 9, speed: -0.014 },
] as const;

type Props = {
  points: GlobePoint[];
  arcs: GlobeArc[];
};

type CloudLayerMesh = {
  mesh: MeshType;
  speed: number;
};

function rotateCloudLayers(globe: ThreeGlobe, delta: number) {
  globe.children.forEach((child) => {
    if (
      child instanceof Mesh &&
      child.userData.isCloudLayer === true &&
      typeof child.userData.cloudSpeed === "number"
    ) {
      child.rotation.y += child.userData.cloudSpeed * delta;
    }
  });
}

function sampleCloudAlpha(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  u: number,
  v: number,
) {
  const x = Math.min(width - 1, Math.max(0, Math.floor(u * width)));
  const y = Math.min(height - 1, Math.max(0, Math.floor(v * height)));
  const index = (y * width + x) * 4;
  const r = pixels[index] / 255;
  const g = pixels[index + 1] / 255;
  const b = pixels[index + 2] / 255;
  const a = pixels[index + 3] / 255;
  const luminance = (r + g + b) / 3;
  return Math.max(luminance, a);
}

function getCloudSampleData(texture: Texture) {
  const image = texture.image as HTMLImageElement | undefined;
  if (!image?.width || !image?.height) return null;

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data, width, height };
}

function createCloudGeometry(
  baseRadius: number,
  sampleData: { data: Uint8ClampedArray; width: number; height: number },
  displacement: number,
) {
  const geometry = new SphereGeometry(baseRadius, 96, 96);
  if (displacement <= 0) return geometry;

  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const length = Math.sqrt(x * x + y * y + z * z) || 1;

    const u = 0.5 + Math.atan2(-z, -x) / (2 * Math.PI);
    const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, y / length))) / Math.PI;
    const alpha = sampleCloudAlpha(
      sampleData.data,
      sampleData.width,
      sampleData.height,
      u,
      v,
    );
    const offset = alpha * displacement;

    positions.setXYZ(
      i,
      x + (normals.getX(i) * offset),
      y + (normals.getY(i) * offset),
      z + (normals.getZ(i) * offset),
    );
  }

  geometry.computeVertexNormals();
  return geometry;
}

function configureGlobe(globe: ThreeGlobe) {
  globe
    .globeImageUrl(EARTH_TEXTURE)
    .showAtmosphere(false)
    .pointLat("lat")
    .pointLng("lng")
    .pointColor(() => "#30cfd0")
    .pointAltitude(0.012)
    .pointRadius(0.3)
    .arcStartLat("startLat")
    .arcStartLng("startLng")
    .arcEndLat("endLat")
    .arcEndLng("endLng")
    .arcColor(() => ["#30cfd0", "#0c5eb6"])
    .arcAltitude(0.14)
    .arcStroke(0.22)
    .arcDashLength(0.45)
    .arcDashGap(0.12)
    .arcDashAnimateTime(3200);
}

export default function EarthGlobe({ points, arcs }: Props) {
  const cloudLayersRef = useRef<CloudLayerMesh[]>([]);
  const cloudsTextureRef = useRef<Texture | null>(null);

  const globe = useMemo(() => {
    const instance = new ThreeGlobe({ animateIn: true });
    configureGlobe(instance);
    return instance;
  }, []);

  useEffect(() => {
    globe.pointsData(points);
    globe.arcsData(arcs);
  }, [globe, points, arcs]);

  useEffect(() => {
    let disposed = false;
    const loader = new TextureLoader();

    loader.load(CLOUDS_TEXTURE, (cloudsTexture) => {
      if (disposed) {
        cloudsTexture.dispose();
        return;
      }

      const sampleData = getCloudSampleData(cloudsTexture);
      if (!sampleData) return;

      cloudsTextureRef.current = cloudsTexture;

      const globeRadius = globe.getGlobeRadius();
      const layers: CloudLayerMesh[] = [];

      for (const layer of CLOUD_LAYERS) {
        const radius = globeRadius * (1 + layer.alt);
        const geometry = createCloudGeometry(radius, sampleData, layer.displacement);
        const material = new MeshPhongMaterial({
          map: cloudsTexture,
          transparent: true,
          opacity: layer.opacity,
          depthWrite: false,
        });

        const mesh = new Mesh(geometry, material);
        mesh.userData.isCloudLayer = true;
        mesh.userData.cloudSpeed = layer.speed;
        mesh.rotation.y = layer.alt * 12;
        globe.add(mesh);
        layers.push({ mesh, speed: layer.speed });
      }

      cloudLayersRef.current = layers;
    });

    return () => {
      disposed = true;

      for (const { mesh } of cloudLayersRef.current) {
        globe.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as MeshPhongMaterial).dispose();
      }

      cloudLayersRef.current = [];
      cloudsTextureRef.current?.dispose();
      cloudsTextureRef.current = null;
    };
  }, [globe]);

  useFrame((_, delta) => {
    rotateCloudLayers(globe, delta);
  });

  return <primitive object={globe} scale={GLOBE_SCALE} />;
}
