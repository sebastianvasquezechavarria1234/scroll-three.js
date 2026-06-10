import { useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Model() {
  const modelRef = useRef()
  const { camera } = useThree()
  const obj = useLoader(OBJLoader, '/super-mario-double-cherry/source/double_cherry.obj')
  const texture = useLoader(THREE.TextureLoader, '/super-mario-double-cherry/textures/DoubleItem_alb.png')

  useEffect(() => {
    if (!obj || !modelRef.current) return

    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture
        child.material.needsUpdate = true
      }
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.bg-gray-900',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })

    tl.to(modelRef.current.position, { x: -3, y: 0, z: 0, ease: 'none' }, 0)
    tl.to(modelRef.current.rotation, { x: 0.175, y: 0.175, z: 0, ease: 'none' }, 0)
    tl.to(camera.position, { x: 0, y: 0, z: 10, ease: 'none' }, 0)

    tl.to(modelRef.current.position, { x: 3, y: 0, z: 0, ease: 'none' }, 0.3)
    tl.to(modelRef.current.rotation, { x: -0.175, y: -0.175, z: 0, ease: 'none' }, 0.3)
    tl.to(camera.position, { x: 0, y: 0, z: 10, ease: 'none' }, 0.3)

    tl.to(modelRef.current.position, { x: 0, y: 0, z: 3, ease: 'none' }, 0.6)
    tl.to(modelRef.current.rotation, { x: 0, y: 0, z: 0, ease: 'none' }, 0.6)
    tl.to(camera.position, { x: 0, y: 0, z: 18, ease: 'none' }, 0.6)

    tl.to(modelRef.current.position, { x: 0, y: 0, z: 1, ease: 'none' }, 0.85)
    tl.to(modelRef.current.rotation, { x: 0, y: Math.PI * 2, z: 0, ease: 'none' }, 0.85)
    tl.to(camera.position, { x: 0, y: 0, z: 18, ease: 'none' }, 0.85)


  }, [obj, texture])

  return (
    <primitive
      ref={modelRef}
      object={obj}
      position={[-3, 0, 0]}
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
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene />
        </Canvas>
      </section>

      <section className="section h-screen flex items-center justify-end pr-20 pointer-events-none">
        <div className="text-right">
          <h2 className="text-6xl font-bold text-white mb-4">Session 1</h2>
          <p className="text-xl text-gray-400">Modelo a la izquierda</p>
        </div>
      </section>

      <section className="section h-screen flex items-center justify-start pl-20 pointer-events-none">
        <div className="text-left">
          <h2 className="text-6xl font-bold text-white mb-4">Session 2</h2>
          <p className="text-xl text-gray-400">Modelo a la derecha</p>
        </div>
      </section>

      <section className="section h-screen flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-white mb-4">Session 3</h2>
          <p className="text-xl text-gray-400">Proximamente</p>
        </div>
      </section>

      <section className="section h-screen flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-white mb-4">Session 4</h2>
          <p className="text-xl text-gray-400">Proximamente</p>
        </div>
      </section>
    </div>
  )
}

export default App
