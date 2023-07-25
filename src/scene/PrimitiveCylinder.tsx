import { Cylinder, Sphere } from "@react-three/drei"
import { Euler, MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three"
import { TriadHelper } from "@glowbuzzer/controls"
import { PrimitiveOriginAxis } from "./PrimitiveOriginAxis"
import { selectedMeshMaterial } from "./materials"
import { useSelected } from "../selection/SelectionProvider"

// Renders a solid cylinder using the info in the selected object, and shows the axis and origin.
export const PrimitiveCylinder = () => {
    const selected = useSelected()

    return (
        <PrimitiveOriginAxis origin={selected.origin} axis={selected.axis}>
            <group position={[0, 0, selected.height / 2]} rotation={[Math.PI / 2, 0, 0]}>
                <Sphere scale={[1, 1, 1]} />
                <Cylinder
                    args={[selected.radius, selected.radius, -selected.height, 32]}
                    material={selectedMeshMaterial}
                />
            </group>
            <TriadHelper size={10} />
        </PrimitiveOriginAxis>
    )
}
