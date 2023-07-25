import { RobotConfigurationSelector } from "./RobotConfigurationSelector"
import { useState } from "react"
import { useAppState } from "../store"
import { ActivityStreamItem, ACTIVITYTYPE, useKinematics } from "@glowbuzzer/store"
import { Space } from "antd"
import { ActivityEditorExtraProps } from "./util"

// Additional options for moves, namely the robot configuration (shoulder, elbow, wrist)
export const EditorForMoveToPositionExtra = ({ activity, onChange }: ActivityEditorExtraProps) => {
    const { sequence } = useAppState()
    const { configuration } = useKinematics(0)
    const index = sequence.findIndex(item => item.activity === activity)

    // get the effective configuration for the current item by applying all previous moves that might have changed it
    const configuration_for_previous = sequence.slice(0, index).reduce((current, item) => {
        if (item.activity.activityType === ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION) {
            const next = item.activity.moveToPosition.cartesianPosition.configuration
            // 255 is the "magic" meaning stay in the current configuration
            return next === 255 ? current : next
        }
        return current
    }, configuration)

    const move_config = activity.moveToPosition.cartesianPosition.configuration

    function update_move_config(value) {
        const updated = JSON.parse(JSON.stringify(activity)) as ActivityStreamItem
        updated.moveToPosition.cartesianPosition.configuration = value
        onChange(updated)
    }

    return (
        <Space>
            <div>Configuration</div>
            <RobotConfigurationSelector
                currentValue={configuration_for_previous}
                value={move_config}
                supportedConfigurationBits={0xffff}
                onChange={update_move_config}
            />
        </Space>
    )
}
