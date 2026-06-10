import { useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

const states = [
  { x: -3, z: 0, rotX: 0.175, rotY: 0.175, camZ: 10 },
  { x: 3, z: 0, rotX: -0.175, rotY: -0.175, camZ: 10 },
  { x: 0, z: 3, rotX: 0, rotY: 0, camZ: 18 },
  { x: 0, z: 1, rotX: 0, rotY: Math.PI * 2, camZ: 18 },
]

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpState(out, a, b, t) {
  out.x = lerp(a.x, b.x, t)
  out.z = lerp(a.z, b.z, t)
  out.rotX = lerp(a.rotX, b.rotX, t)
  out.rotY = lerp(a.rotY, b.rotY, t)
  out.camZ = lerp(a.camZ, b.camZ, t)
}

function Model() {
  const modelRef = useRef()
  const { camera } = useThree()
  const obj = useLoader(OBJLoader, '/super-mario-double-cherry/source/double_cherry.obj')
  const texture = useLoader(THREE.TextureLoader, '/super-mario-double-cherry/textures/DoubleItem_alb.png')

  const current = useRef({ ...states[0] })
  const target = useRef({ ...states[0] })

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
      const sections = document.querySelectorAll('.section')
      if (sections.length === 0) return

      const viewCenter = window.scrollY + window.innerHeight / 2

      let fromIndex = 0
      let toIndex = 0
      let t = 0

      for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop
        const sectionBottom = sectionTop + sections[i].offsetHeight

        if (viewCenter >= sectionTop && viewCenter < sectionBottom) {
          fromIndex = i
          toIndex = Math.min(i + 1, sections.length - 1)
          t = (viewCenter - sectionTop) / sections[i].offsetHeight
          break
        }

        if (viewCenter >= sectionBottom) {
          fromIndex = i
          toIndex = Math.min(i + 1, sections.length - 1)
          t = 1
        }
      }

      if (viewCenter < sections[0].offsetTop) {
        fromIndex = 0
        toIndex = 0
        t = 0
      }

      const from = states[Math.min(fromIndex, states.length - 1)]
      const to = states[Math.min(toIndex, states.length - 1)]
      lerpState(target.current, from, to, t)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (!modelRef.current) return
    const speed = 0.1
    current.current.x += (target.current.x - current.current.x) * speed
    current.current.z += (target.current.z - current.current.z) * speed
    current.current.rotX += (target.current.rotX - current.current.rotX) * speed
    current.current.rotY += (target.current.rotY - current.current.rotY) * speed
    current.current.camZ += (target.current.camZ - current.current.camZ) * speed

    modelRef.current.position.x = current.current.x
    modelRef.current.position.z = current.current.z
    modelRef.current.rotation.x = current.current.rotX
    modelRef.current.rotation.y = current.current.rotY
    camera.position.z = current.current.camZ
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
