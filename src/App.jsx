import { useRef, useEffect, useState } from 'react'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

function Model() {
  const modelRef = useRef()
  const { camera } = useThree()
  const obj = useLoader(OBJLoader, '/super-mario-double-cherry/source/double_cherry.obj')
  const texture = useLoader(THREE.TextureLoader, '/super-mario-double-cherry/textures/DoubleItem_alb.png')

  const targetPos = useRef(new THREE.Vector3(-3, 0, 0))
  const targetRot = useRef(new THREE.Euler(0.175, 0.175, 0))
  const targetCamZ = useRef(10)

  useEffect(() => {
    if (!obj) return
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture
        child.material.needsUpdate = true
      }
    })
  }, [obj, texture])

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const p = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1)

      if (p < 0.25) {
        const t = p / 0.25
        targetPos.current.set(-3 + t * 6, 0, 0)
        targetRot.current.set(0.175 - t * 0.35, 0.175 - t * 0.35, 0)
        targetCamZ.current = 10
      } else if (p < 0.5) {
        const t = (p - 0.25) / 0.25
        targetPos.current.set(3 - t * 3, 0, t * 3)
        targetRot.current.set(-0.175 + t * 0.175, -0.175 + t * 0.175, 0)
        targetCamZ.current = 10 + t * 8
      } else if (p < 0.75) {
        const t = (p - 0.5) / 0.25
        targetPos.current.set(0, 0, 3 - t * 2)
        targetRot.current.set(0, t * (Math.PI * 2), 0)
        targetCamZ.current = 18
      } else {
        const t = (p - 0.75) / 0.25
        targetPos.current.set(0, 0, 1)
        targetRot.current.set(0, Math.PI * 2, 0)
        targetCamZ.current = 18
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (!modelRef.current) return
    const lerp = 0.1
    modelRef.current.position.lerp(targetPos.current, lerp)
    modelRef.current.rotation.x += (targetRot.current.x - modelRef.current.rotation.x) * lerp
    modelRef.current.rotation.y += (targetRot.current.y - modelRef.current.rotation.y) * lerp
    modelRef.current.rotation.z += (targetRot.current.z - modelRef.current.rotation.z) * lerp
    camera.position.z += (targetCamZ.current - camera.position.z) * lerp
  })

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
