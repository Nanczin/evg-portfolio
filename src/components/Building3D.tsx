"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Building component with mouse parallax
function Building() {
    const buildingRef = useRef<THREE.Group>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state) => {
        if (buildingRef.current) {
            // Smooth parallax rotation based on mouse position
            buildingRef.current.rotation.y = THREE.MathUtils.lerp(
                buildingRef.current.rotation.y,
                mousePosition.x * 0.3,
                0.05
            );
            buildingRef.current.rotation.x = THREE.MathUtils.lerp(
                buildingRef.current.rotation.x,
                mousePosition.y * 0.15,
                0.05
            );

            // Subtle floating animation
            buildingRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    // Gold accent color matching brand
    const goldColor = "#D4AF37";
    const darkGray = "#1a1a1a";
    const lightGray = "#2a2a2a";

    return (
        <group ref={buildingRef} position={[0, -2, 0]}>
            {/* Main tower */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 8, 1.5]} />
                <meshStandardMaterial
                    color={darkGray}
                    metalness={0.8}
                    roughness={0.2}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Gold accent bands */}
            <mesh position={[0, 4, 0]} castShadow>
                <boxGeometry args={[1.6, 0.2, 1.6]} />
                <meshStandardMaterial
                    color={goldColor}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={goldColor}
                    emissiveIntensity={0.3}
                />
            </mesh>

            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[1.6, 0.2, 1.6]} />
                <meshStandardMaterial
                    color={goldColor}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={goldColor}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Secondary tower */}
            <mesh position={[2, 1.5, -0.5]} castShadow receiveShadow>
                <boxGeometry args={[1, 6, 1]} />
                <meshStandardMaterial
                    color={lightGray}
                    metalness={0.7}
                    roughness={0.3}
                />
            </mesh>

            {/* Third tower */}
            <mesh position={[-2, 1, 0.5]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 5, 0.8]} />
                <meshStandardMaterial
                    color={darkGray}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Glass windows effect - front face */}
            {[...Array(12)].map((_, i) => (
                <mesh
                    key={`window-front-${i}`}
                    position={[
                        -0.5 + (i % 3) * 0.5,
                        -1 + Math.floor(i / 3) * 1.5,
                        0.76
                    ]}
                    castShadow
                >
                    <boxGeometry args={[0.3, 0.4, 0.02]} />
                    <meshStandardMaterial
                        color="#1a3a4a"
                        metalness={1}
                        roughness={0}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}

            {/* Base/foundation */}
            <mesh position={[0, -2, 0]} receiveShadow>
                <boxGeometry args={[4, 0.5, 4]} />
                <meshStandardMaterial
                    color={darkGray}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            {/* Gold top accent */}
            <mesh position={[0, 6.2, 0]} castShadow>
                <boxGeometry args={[1.8, 0.4, 1.8]} />
                <meshStandardMaterial
                    color={goldColor}
                    metalness={1}
                    roughness={0}
                    emissive={goldColor}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    );
}

// Main 3D Scene
export default function Building3D() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                dpr={[1, 2]}
            >
                {/* Camera */}
                <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={50} />

                {/* Lights */}
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, 5, -10]} intensity={0.5} color="#D4AF37" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.5}
                    castShadow
                    color="#D4AF37"
                />

                {/* Building */}
                <Building />

                {/* Subtle fog for depth */}
                <fog attach="fog" args={["#000000", 5, 20]} />
            </Canvas>
        </div>
    );
}
