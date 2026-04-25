import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  file: string
  color: string
  position?: [number, number, number]
}

export default function ShoeModel({ file, color, position = [0, 0, 0] }: Props) {
  const { nodes } = useGLTF(file) as any
  const sourceMesh: THREE.Mesh = nodes['mesh_0']

  // Clone so we never mutate the cached GLB — each mount gets its own copy
  const mesh = useMemo(() => {
    if (!sourceMesh) return null
    return sourceMesh.clone(true)
  }, [sourceMesh])

  useEffect(() => {
    if (!mesh) return
    const applyColor = (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh) {
        // Clone material too, so color changes are isolated to this instance
        if (!('_cloned' in obj.userData)) {
          obj.material = (obj.material as THREE.MeshStandardMaterial).clone()
          obj.userData._cloned = true
        }
        const mat = obj.material as THREE.MeshStandardMaterial
        mat.color.set(color)
        mat.needsUpdate = true
      }
      obj.children.forEach(applyColor)
    }
    applyColor(mesh)
  }, [mesh, color])

  if (!mesh) return null
  return <primitive object={mesh} scale={0.9} position={position} />
}

useGLTF.preload('/shoe.glb')
useGLTF.preload('/airlift.glb')
