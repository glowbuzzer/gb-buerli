import { WeldingTorch } from "./WeldingTorch"
import { useToolConfig, useToolIndex } from "@glowbuzzer/store"
import { Cylinder } from "@react-three/drei"

/** Render a generic tool as a cylinder. Note that this doesn't support rotation */
const GenericTool = props => {
    const index = useToolIndex(0)
    const { diameter, translation } = useToolConfig(index)
    const radius = diameter / 2
    const length = translation.z
    return (
        <Cylinder
            args={[radius, radius, translation.z, 32]}
            position={[0, 0, translation.z / 2]}
            rotation={[Math.PI / 2, 0, 0]}
        >
            <meshBasicMaterial color={"#999999"} opacity={0.5} {...props} />
        </Cylinder>
    )
}

export const Tool = props => {
    const current_tool = useToolIndex(0)
    return {
        0: null,
        1: <WeldingTorch {...props} />,
        2: <GenericTool {...props} />
    }[current_tool]
}
