"use client"

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ScrollContainer } from "./scrollContianer";

export function MainCanvas() {
    return (
        <>
            <div className="w-screen h-screen fixed top-0 left-0 -z-0 pointer-events-none">
                <Canvas
                    shadows
                    dpr={[1, 2]}
                    camera={{fov:20, position: [-5, 0, 10] }}
                >
                    <Environment files="/images/hdri-environment.jpg" />
                    <ScrollContainer />
                </Canvas>
            </div>

            <div
            className="fixed inset-0 z-0"
            onWheel={(e) => window.scrollBy({ top: e.deltaY, behavior: "smooth" })}
            ></div>            
        </>
    )
}