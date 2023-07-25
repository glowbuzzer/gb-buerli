import { appSlice, useAppState } from "../store"
import {
    calc_previous_position,
    clone,
    get_position_for_activity,
    is_valid_rotation,
    set_rotation
} from "../util"
import { useKinematicsCartesianPosition, useToolConfig, useToolIndex } from "@glowbuzzer/store"
import { useMemo } from "react"
import { Quaternion, Vector3 } from "three"
import { TransformControls } from "@react-three/drei"
import { TriadHelper } from "@glowbuzzer/controls"
import { useDispatch } from "react-redux"
import { WeldingTorch } from "./WeldingTorch"
import { Tool } from "./Tool"

export const ToolPreview = () => {
    const { sequence } = useAppState()
    const { position: tcp_position } = useKinematicsCartesianPosition(0)
    const current_tool = useToolIndex(0)
    const tool = useToolConfig(current_tool)
    const dispatch = useDispatch()

    // note that only one item can be previewed at a time
    const index = sequence.findIndex(item => item.preview)
    const previousPosition = calc_previous_position(sequence, index, tcp_position.rotation)
    const item = sequence[index]

    function update_transform(e) {
        if (e.target === null) {
            return
        }
        // set the rotation of the activity and update the store
        const update = clone(item)
        set_rotation(update, e.target.object.quaternion)
        dispatch(appSlice.actions.updateActivity(update))
    }

    const {
        position: { translation, rotation }
    } = get_position_for_activity(item.activity)

    // these are where the target for the activity after the move
    const target_position = new Vector3().copy(translation as any)
    // the rotation can be specified explicitly or be inherited from the previous position
    const target_quaternion = new Quaternion().copy(
        is_valid_rotation(rotation) ? (rotation as any) : (previousPosition.rotation as any)
    )

    const toolGroupProps = useMemo(() => {
        // calculate the inverse of the tool transformation, so that the resulting TCP is at the correct position
        const quaternion = new Quaternion().copy(tool.rotation as any).invert()
        const position = new Vector3()
            .copy(tool.translation as any)
            .applyQuaternion(quaternion)
            .negate()
        return { position, quaternion }
    }, [tool.translation, tool.rotation])

    return (
        <TransformControls
            mode="rotate"
            size={0.7}
            onMouseUp={update_transform}
            space="local"
            position={target_position}
            quaternion={target_quaternion}
        >
            <group>
                <TriadHelper size={30} />
                <group {...toolGroupProps}>
                    <Tool transparent />
                </group>
            </group>
        </TransformControls>
    )
}
