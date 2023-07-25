import { Cylinder, Sphere } from "@react-three/drei"
import { PrimitiveOriginAxis } from "./PrimitiveOriginAxis"
import { selectedMeshMaterial } from "./materials"
import { useSelected } from "../selection/SelectionProvider"
import { TriadHelper } from "@glowbuzzer/controls"

// Renders a solid cone using the info in the selected object, and shows the axis and origin.
export const PrimitiveCone = () => {
    const selected = useSelected()

    return (
        <PrimitiveOriginAxis origin={selected.origin} axis={selected.axis}>
            <group position={[0, 0, selected.height / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <Cylinder
                    args={[selected.radiusTop, selected.radiusBottom, -selected.height, 32]}
                    material={selectedMeshMaterial}
                />
                <Sphere scale={[1, 1, 1]} />
            </group>
            <TriadHelper size={10} />
        </PrimitiveOriginAxis>
    )
}
