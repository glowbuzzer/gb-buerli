import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { Mesh } from "three"

// Renders the welding torch tool
export const WeldingTorch = ({ transparent = false }) => {
    const torchGltf = useGLTF("/assets/welding_torch.glb")

    // The welding torch only ever appears in one place, so we can adjust the material opacity
    // whenever the transparent prop changes (the loaded gltf is a singleton)
    const torch = useMemo(() => {
        const torch = torchGltf.scene
        torch.traverse(child => {
            if (child instanceof Mesh) {
                child.material.transparent = true
                child.material.opacity = transparent ? 0.5 : 1
                child.material.needsUpdate = true
            }
        })
        return torch
    }, [torchGltf, transparent])

    return (
        <group scale={500} rotation={[0, Math.PI / 2, Math.PI / 2]}>
            <primitive object={torch} />
        </group>
    )
}
