"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

function WavingRibbon() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry
      const positionAttribute = geometry.attributes.position

      // CHANGE THIS VALUE TO CONTROL GLOBAL SPEED
      // 0.5 = Half speed, 2.0 = Double speed
      const speed = 0.2 

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i)
        const y = positionAttribute.getY(i)

        // Multiply time by your speed variable
        const t = time * speed 

        const waveX = Math.sin(x * 0.5 + t * 0.8) * 0.3
        const waveY = Math.sin(y * 0.3 + t * 0.6) * 0.2
        const waveZ =
          Math.sin(x * 0.5 + t) * 0.8 +
          Math.sin(y * 0.3 + t * 1.5) * 0.5 +
          Math.sin(x * 0.2 + y * 0.2 + t) * 0.7

        positionAttribute.setZ(i, waveZ + waveX + waveY)
      }

      positionAttribute.needsUpdate = true
      geometry.computeVertexNormals()

      // Don't forget to apply speed here too if you want rotation to match
      meshRef.current.rotation.z = Math.sin(time * speed * 0.2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 5.5, 70, 3]} />
      <meshStandardMaterial 
        color="#ffffff" 
        side={THREE.DoubleSide} 
        metalness={0.2} 
        roughness={1} 
        wireframe={false} />
    </mesh>
  )
}

function TextSprite({ char, color = "white" }: { char: string; color?: string }) {
  const sprite = useMemo(() => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return null

    canvas.width = 128
    canvas.height = 128

    context.font = "bold 80px Arial, sans-serif"
    context.fillStyle = color
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText(char, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const spriteObj = new THREE.Sprite(material)
    spriteObj.scale.set(0.5, 0.5, 1)

    return spriteObj
  }, [char, color])

  return sprite ? <primitive object={sprite} /> : null
}

export default function Home() {

  const textPathTopRef = useRef<SVGTextPathElement>(null)
  const textPathBottomRef = useRef<SVGTextPathElement>(null)

  const textString = "REFRESHING • DELICIOUS • ICONIC • CLASSIC • "
  
  // 1. Calculate the pattern width for a seamless loop
  const patternWidth = useMemo(() => {
    if (typeof document === 'undefined') return 0 // Server-side guard
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (context) {
      // Must match the font settings in the SVG <text> below
      context.font = "bold 40px Arial, sans-serif" 
      return context.measureText(textString).width
    }
    return 0
  }, [])

  // 2. Ensure we have enough repetitions to cover the path + buffer
  // The viewBox width is 1400, but the curve is longer, roughly 1600-1800.
  // We add extra repetitions to ensure no gaps during the scroll.
  const repeatedText = useMemo(() => {
    return Array(12).fill(textString).join("")
  }, [])

  useEffect(() => {
    if (!patternWidth) return

    let animationFrameId: number
    let currentDist = 0

    const animate = () => {
      // 3. Move by pixels per frame
      // Adjust this value to change speed (e.g., 2 is faster, 0.5 is slower)
      currentDist += 0.5 

      // 4. The Seamless Loop Logic:
      // Instead of relying on path %, we use the Modulo operator (%) 
      // based on the text width.
      // This ensures that strictly every X pixels, the loop seamlessly wraps.
      // We subtract 'patternWidth * 8' (or any large multiple) to start 
      // the text far back to the left, ensuring the path is fully filled at start.
      const offset = (currentDist % patternWidth) - (patternWidth * 8)

      if (textPathTopRef.current) {
        // SVG supports unitless numbers which are interpreted as user-space pixels
        textPathTopRef.current.setAttribute("startOffset", `${offset}`)
      }
      if (textPathBottomRef.current) {
        textPathBottomRef.current.setAttribute("startOffset", `${offset}`)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [patternWidth])

  return (
    <div className="z-50">
      <div
        id="hero"
        className="relative flex h-screen min-h-screen items-center justify-center bg-red-500 font-sans dark:bg-black"
      >
        {/* Three.js Canvas Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={2} color={"#ffffff"} />
            <directionalLight position={[10, 10, 5]} intensity={2} color={"#ffffff"} />
            <directionalLight position={[-10, -10, -5]} intensity={2} color={"#ffffff"} />
            <WavingRibbon />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 w-2/3 flex flex-col items-start justify-center px-10 text-center">
          <h1 className="w-full font-lokicola text-[300px]/[0.3] text-red-500">Coca Cola</h1>
          <h2 className="w-full font-cocacola text-[80px] text-red-500 mt-4">It's a demo page</h2>
          <sub className="w-full text-xl">This is not optimized for mobile 🤫 make sure to view this in 1920 x 1080</sub>
        </div>
        <div className="relative z-10 w-1/3"></div>
      </div>
      <div className="h-screen flex min-h-screen items-center justify-center bg-linear-to-t from-black to-red-500 font-sans">
        <div className="relative z-10 w-2/3 flex flex-col items-start justify-center px-[220px] text-center">
          <h3 className="w-full font-lokicola text-[200px]/[0.8] text-white">The Dev</h3>
          <p className="w-full text-[30px] text-white mt-4 text-justify">
            I created a sample Coca-Cola-inspired landing page to showcase my skills in Next, Three.js, GSAP and Three Fiber, featuring interactive 3D elements, dynamic animations, and immersive visuals that bring the brand experience to life.
          </p>

          <p className="w-full text-[20px] text-white mt-4 text-justify">
            <i><strong>Dev Notes: </strong> 
              I don't know if I really want to add more to this; I rant out creative juice creating the 3D model. this is just a sample WebGL marketing page anyway. 
              I'm looking for a designer to partner with or a team who I can contribute my skills to. I can create both WebGL sites, and the 3D models (in case the client needs one).
              In addition, I also know how to do photography, videography, and image and video post production.
            </i>
          </p>

          <p className="w-full text-[20px] text-white mt-4 text-justify">
            If you wanna learn more about me, feel free to visit <a className="font-black text-amber-300" href="https://webdev.eejay.me" target="_new">The Coolest WebGL Portfolio in Winnipeg, MB</a>
          </p>                     
        </div>
        <div className="relative z-10 w-1/3"></div>        
      </div>
      <div id="coolSection" className="relative h-screen flex min-h-screen items-center justify-center bg-black font-sans overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 1400 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="wavePathTop" d="M0 200 Q 175 150 350 200 T 700 200 T 1050 200 T 1400 200" fill="none" />
              <path id="wavePathBottom" d="M0 400 Q 175 350 350 400 T 700 400 T 1050 400 T 1400 400" fill="none" />

              <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Ribbon Background */}
            <path
              d="M0 200 Q 175 150 350 200 T 700 200 T 1050 200 T 1400 200 L 1400 400 Q 1225 450 1050 400 T 700 400 T 350 400 T 0 400 Z"
              fill="url(#ribbonGradient)"
              opacity="0.6"
            />

            {/* Top Text - No <animate> tag, using ref instead */}
            <text fill="white" fontSize="40" fontWeight="bold" fontFamily="Arial, sans-serif">
              <textPath 
                ref={textPathTopRef} 
                xlinkHref="#wavePathTop" 
                startOffset="-100%"
              >
                {repeatedText}
              </textPath>
            </text>

            {/* Bottom Text - No <animate> tag, using ref instead */}
            <g transform="translate(0, 30)">
              <text fill="white" fontSize="40" fontWeight="bold" fontFamily="Arial, sans-serif">
                <textPath 
                  ref={textPathBottomRef} 
                  xlinkHref="#wavePathBottom" 
                  startOffset="-100%"
                >
                  {repeatedText}
                </textPath>
              </text>
            </g>
          </svg>
        </div>

        <div className="relative z-10">{/* Add any foreground content here */}</div>
      </div>
    </div>
  )
}
