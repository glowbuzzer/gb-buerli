import { Dropdown, List } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import { ActivityBuilder, ACTIVITYTYPE } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { appSlice } from "../store"
import { ActivityTargetPoint, graphicTypeProperties } from "../types"
import { useMemo } from "react"
import { random_id } from "../util"
import { activityTypeProperties } from "../sequence/util"

type SelectedObjectSupportedMovesProps = {
    selection: any
    target: ActivityTargetPoint
}

// Given a selection from the model and a logical target point (for example, start or end point),
// render a list of available activities that can be added to the sequence
export const SelectedObjectSupportedMoves = ({
    selection,
    target
}: SelectedObjectSupportedMovesProps) => {
    const dispatch = useDispatch()

    function add(builder: ActivityBuilder) {
        // add a new activity to the sequence, and set it as the activity to preview
        dispatch(
            appSlice.actions.addActivity({
                id: random_id(),
                preview: true,
                selection: { ...selection },
                activity: builder.command
            })
        )
    }

    // the activity factory is responsible for creating a set of valid activities for the given selection and target point
    const { activityFactory } = graphicTypeProperties(selection.type)
    const activities = useMemo(() => activityFactory?.(target, selection), [target, selection])

    if (!activities?.length) {
        return null
    }

    // convert the given activities to menu items
    const items = activities?.map(({ activityType, builder }) => ({
        key: activityType,
        label: activityTypeProperties(activityType).title,
        onClick: () => add(builder)
    }))

    return (
        <List.Item>
            <div>{target}</div>
            <Dropdown menu={{ items }} trigger={["click"]}>
                <PlusCircleOutlined size={25} style={{ fontSize: "18px" }} />
            </Dropdown>
        </List.Item>
    )
}
