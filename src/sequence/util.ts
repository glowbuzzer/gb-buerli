import { ActivityStreamItem, ACTIVITYTYPE } from "@glowbuzzer/store"
import { EditorForMoveToPositionExtra } from "./EditorForMoveToPositionExtra"
import { EditorForArcExtra } from "./EditorForArcExtra"

export type ActivityEditorExtraProps = {
    selection: any
    activity: ActivityStreamItem
    onChange: (activity: ActivityStreamItem) => void
}

type ActivityTypeProperties = {
    title: string
    editorExtra?: (props: ActivityEditorExtraProps) => JSX.Element
}

const types: Partial<Record<ACTIVITYTYPE, ActivityTypeProperties>> = {
    [ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE]: {
        title: "Move in Straight Line"
    },
    [ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION]: {
        title: "Move in Joint Space",
        editorExtra: EditorForMoveToPositionExtra
    },
    [ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC]: {
        title: "Move in Arc",
        editorExtra: EditorForArcExtra
    }
}

export function activityTypeProperties(type: ACTIVITYTYPE): ActivityTypeProperties {
    return types[type] || { title: "Unknown Activity Type" }
}
