import { Cylinder } from "@react-three/drei"
import { useToolConfig } from "@glowbuzzer/store"
import { MeshBasicMaterial } from "three"

const toolMaterial = new MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5
})

export const ToolDisc = () => {
    const { diameter: toolDiameter, translation } = useToolConfig(0)
    const height = translation?.z || 0
    const width = Math.sqrt(Math.pow(translation.x, 2) + Math.pow(translation.y, 2)) || 0
    const disc = width + toolDiameter / 2
    const disc_height = height / 20

    if (!width) {
        return null
    }

    return (
        <Cylinder
            args={[disc, disc, disc_height, 32]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            position={[0, 0, disc_height / 2]}
            material={toolMaterial}
        />
    )
}

export const GenericTool = () => {
    const { diameter: toolDiameter, translation } = useToolConfig(0)
    const height = translation?.z || 0

    return (
        <>
            <Cylinder
                args={[toolDiameter / 2, toolDiameter / 2, height, 32]}
                position={[0, 0, -height / 2]}
                rotation={[Math.PI / 2, 0, 0]}
                material={toolMaterial}
            />
        </>
    )
}
