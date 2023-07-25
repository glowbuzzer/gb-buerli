import { useGLTF } from "@react-three/drei"

export const WeldingTable = () => {
    const table = useGLTF("/welding table edit.glb")
    return (
        <group scale={[1000, 1000, 1000]} quaternion={[0, 1, 0, 0]}>
            <primitive object={table.scene} />
        </group>
    )
}
