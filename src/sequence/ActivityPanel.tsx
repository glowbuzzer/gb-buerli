import { ActivitySequenceItem } from "../store"
import { Space } from "antd"
import { SelectionProvider } from "../selection/SelectionProvider"
import React from "react"
import { CartesianPosition } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { activityTypeProperties } from "./util"
import { get_position_for_activity, update_position_for_activity } from "../util"
import { EditorForMove } from "./EditorForMove"

// Provides user interface to edit the selected activity. The specific editor is based on the activity type.
export const ActivityPanel = ({
    sequenceItem,
    previousPosition,
    onChange
}: {
    sequenceItem: ActivitySequenceItem
    previousPosition: CartesianPosition
    onChange
}) => {
    const { selection: selected, activity } = sequenceItem

    const {
        // editor: Component,
        editorExtra: ComponentExtra
        // targetPositionSelector
    } = activityTypeProperties(activity.activityType)

    function update_translation(value: Vector3) {
        const { x, y, z } = value
        const updated = update_position_for_activity(activity, {
            translation: { x, y, z }
        })
        onChange(updated)
    }

    function update_quaternion(value: Quaternion) {
        const { x, y, z, w } = value
        const updated = update_position_for_activity(activity, {
            rotation: { x, y, z, w }
        })
        onChange(updated)
    }

    const { position } = get_position_for_activity(activity)

    return (
        <SelectionProvider selection={selected}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <EditorForMove
                    item={sequenceItem}
                    previousPosition={previousPosition}
                    onChangeTranslation={update_translation}
                    onChangeQuaternion={update_quaternion}
                    targetPosition={position}
                />
                {ComponentExtra ? (
                    <ComponentExtra selection={selected} activity={activity} onChange={onChange} />
                ) : null}
            </Space>
        </SelectionProvider>
    )
}
