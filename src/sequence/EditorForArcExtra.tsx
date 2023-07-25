import { Checkbox } from "antd"
import { ActivityStreamItem, ARCDIRECTION, ROTATIONINTERPOLATION } from "@glowbuzzer/store"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { ActivityEditorExtraProps } from "./util"

// Additional options for arcs, namely how to interpolate the rotation change
export const EditorForArcExtra = ({ activity, onChange }: ActivityEditorExtraProps) => {
    function update_rotation_interpolation(event: CheckboxChangeEvent) {
        const updated = JSON.parse(JSON.stringify(activity)) as ActivityStreamItem
        updated.moveArc.arc.rotationInterpolation = event.target.checked
            ? ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_LONG_SLERP
            : ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_SHORT_SLERP
        onChange(updated)
    }

    return (
        <div>
            <Checkbox
                checked={
                    activity.moveArc.arc.rotationInterpolation ===
                    ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_LONG_SLERP
                }
                onChange={update_rotation_interpolation}
            >
                Use long rotation interpolation
            </Checkbox>
        </div>
    )
}
