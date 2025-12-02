"use client"

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Model } from "./modelCan";

gsap.registerPlugin(ScrollTrigger);

// Simple cylinder component with forwarded ref
const Cylinder = React.forwardRef<THREE.Mesh>((props, ref) => (
    <mesh ref={ref} {...props}>
        <cylinderGeometry args={[1, 1, 1, 32, 32]} />
        <meshStandardMaterial color="orange" />
    </mesh>
));

// Optional: another mesh component
function Box() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    )
}

export function MainScene() {
    const can1Ref = useRef<any>(null);
    const can1SpinRef = useRef<any>(null);
    const initialPosition = new THREE.Vector3(2, 0, 0);

    useEffect(() => {
      if (!can1Ref.current || !can1SpinRef.current) return;

      console.log("Animation started");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          markers: true,
        }
      });


      // Timeline for group movement and rotation
      // Move and rotate the group simultaneously at the start
      timeline.to(can1Ref.current.position, {
        x: 0.5,
        y: 0,
        z: 3,
        ease: "power1.in",
        duration: 1,
        onStart: () => console.log("Group position move started"),
        onComplete: () => console.log("Group position move complete"),
      }, 0)
      .to(can1Ref.current.rotation, {
        x: Math.PI / 4,
        y: Math.PI / -4,
        ease: "power1.in",
        duration: 1,
        onStart: () => console.log("Group rotation started"),
        onComplete: () => {
          console.log("Group rotation complete");

          // Start continuous cylinder spin AFTER group rotation completes
          gsap.to(can1SpinRef.current.rotation, {
            y: "+=6.28", // full rotation (2π radians)
            duration: 16,
            ease: "linear",
            repeat: -1,  // infinite loop
            onStart: () => console.log("Cylinder spin started"),
            onComplete: () => console.log("Cylinder spin complete"),
          });
        }
      }, 0);

      // Bring group back to original position and rotation
      timeline.to(can1Ref.current.position, {
        x: 0,
        y: 0,
        z: 0,
        ease: "power1.out",
        duration: 1,
        onStart: () => console.log("Group position return started"),
        onComplete: () => console.log("Group position return complete"),
      }, 5)
      .to(can1Ref.current.rotation, {
        x: 0,
        ease: "power1.out",
        duration: 1,
        onStart: () => console.log("Group rotation return started"),
        onComplete: () => console.log("Group rotation return complete"),
      }, 5);
    
    }, []);

  return (
    <>
      <group ref={can1Ref} position={initialPosition}>
          <group ref={can1SpinRef}>
              <Model />
          </group>
      </group>
    </>
  )
}

