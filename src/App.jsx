import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Model() {
  const { scene } = useGLTF('/model.glb')
  const modelRef = useRef()

  useEffect(() => {
    if (!modelRef.current) return

    gsap.to(modelRef.current.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    gsap.to(modelRef.current.position, {
      y: -2,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
  }, [])

  return <primitive ref={modelRef} object={scene} />
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Model />
      <OrbitControls enableZoom={false} />
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
          <h1 className="text-5xl font-bold text-white mb-4">Scroll para mover el modelo</h1>
          <p className="text-xl text-gray-400">El modelo 3D rotará y se moverá con el scroll</p>
        </div>
      </section>
    </div>
  )
}

export default App
