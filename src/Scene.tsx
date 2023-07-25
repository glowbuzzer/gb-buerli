import { BuerliGeometry } from "@buerli.io/react"
import { CurrentSelectionSceneDisplay } from "./scene/CurrentSelectionSceneDisplay"
import { useAppState } from "./store"
import { Euler, Group, Mesh, Quaternion, Vector3 } from "three"
import { useEffect, useMemo, useRef } from "react"
import { extend } from "@react-three/fiber"
import { Line2, LineGeometry, LineMaterial } from "three-stdlib"
import { StaubliRobot } from "./StaubliRobot"
import { TrackPosition, TriadHelper } from "@glowbuzzer/controls"
import { WeldingTorch } from "./scene/WeldingTorch"
import { useFrame, useToolIndex } from "@glowbuzzer/store"
import { ToolPreview } from "./scene/ToolPreview"
import { WeldingTable } from "./scene/WeldingTable"
import { Tool } from "./scene/Tool"
import { projects } from "./projects"

extend({ Line2, LineMaterial, LineGeometry })

// the main 3d scene
export const Scene = () => {
    const { projectIndex, selected, sequence } = useAppState()
    const groupRef = useRef<Group>()
    const { translation: modelTranslation, rotation: modelRotation } = useFrame(0)

    useEffect(() => {
        // set the opacity of the model to 0.5 when selected
        groupRef.current?.traverse(child => {
            if (child instanceof Mesh) {
                child.material.transparent = true
                child.material.opacity = selected ? 0.5 : 1
                child.material.needsUpdate = true
            }
        })
    }, [selected])

    const is_preview = sequence.some(item => item.preview)
    const position = new Vector3().copy(modelTranslation as any)
    const quaternion = new Quaternion().copy(modelRotation as any)

    return (
        <>
            <WeldingTable />
            <group position={position} quaternion={quaternion}>
                <group ref={groupRef}>
                    <BuerliGeometry selection />
                </group>
                <CurrentSelectionSceneDisplay />
                {is_preview && <ToolPreview />}
            </group>

            <StaubliRobot kinematicsConfigurationIndex={0}>{!is_preview && <Tool />}</StaubliRobot>
            <TrackPosition kinematicsConfigurationIndex={0}>
                <TriadHelper size={30} />
            </TrackPosition>
        </>
    )
}
