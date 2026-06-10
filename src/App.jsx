import { useRef, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Model() {
  const modelRef = useRef()
  const obj = useLoader(OBJLoader, '/super-mario-double-cherry/source/double_cherry.obj')
  const texture = useLoader(THREE.TextureLoader, '/super-mario-double-cherry/textures/DoubleItem_alb.png')

  useEffect(() => {
    if (!obj) return

    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture
        child.material.needsUpdate = true
      }
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    tl.to(modelRef.current.rotation, { y: Math.PI * 2 }, 0)
    tl.to(modelRef.current.position, { y: -2 }, 0)
    tl.to(modelRef.current.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0)
  }, [obj, texture])

  return (
    <primitive
      ref={modelRef}
      object={obj}
      position={[0, 1, 0]}
      scale={[0.5, 0.5, 0.5]}
    />
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <Model />
    </>
  )
}

function App() {
  return (
    <div className="bg-gray-900">
      <section className="h-screen sticky top-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene />
        </Canvas>
      </section>

      <section className="h-[400vh] pointer-events-none">
        <div className="sticky top-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Super Mario Double Cherry</h1>
          <p className="text-xl text-gray-400">Scroll para rotar y mover el modelo</p>
        </div>
      </section>
    </div>
  )
}

export default App
