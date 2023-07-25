import { styled } from "styled-components"
import { ActivityPanel } from "../sequence/ActivityPanel"
import { appSlice, useAppState } from "../store"
import { Button, Collapse, CollapseProps, Space } from "antd"
import {
    ActivityStreamItem,
    STREAMCOMMAND,
    streamSlice,
    useKinematics,
    useStream
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { calc_previous_position } from "../util"
import { Quaternion } from "three"
import { activityTypeProperties } from "../sequence/util"
import React from "react"
import { generateActivitiesForSequence } from "../activities"

const StyledTile = styled.div`
    padding: 10px;
`

// This tile displays the sequence of activities that the user has created, and allows them to be executed
export const ActivitySequenceTile = () => {
    const { position } = useKinematics(0)
    const { sequence } = useAppState()
    const stream = useStream(0)
    const dispatch = useDispatch()

    function exec() {
        dispatch(appSlice.actions.cancelPreview())
        dispatch(appSlice.actions.clearSelection())

        // use the current rotation of the robot as input
        const rotation = new Quaternion().copy(position.rotation as any)

        // produce the file array of activities to execute
        const activities = Array.from(generateActivitiesForSequence(rotation, sequence))

        // queue up the activities
        dispatch(streamSlice.actions.append({ streamIndex: 0, buffer: activities }))
        // and command the queue to start
        stream.sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
    }

    function update_activity(index: number, activity: ActivityStreamItem) {
        dispatch(appSlice.actions.updateActivityStreamItem({ index, activity }))
    }

    // the active key is the id of the activity that is currently being previewed (and will be expanded in the collapseable list)
    const activeKey = sequence.find(item => item.preview)?.id

    // create the list of items to display in the collapseable list
    const items: CollapseProps["items"] = sequence.map((item, index) => {
        const { title } = activityTypeProperties(item.activity.activityType)

        function select(e) {
            dispatch(appSlice.actions.setSelected(item.selection))
            e.stopPropagation()
        }

        function remove() {
            dispatch(appSlice.actions.removeActivity(item.id))
        }

        return {
            key: item.id,
            label: <div className="item-header">{title}</div>,
            extra: (
                <Space>
                    {item.selection.type.toUpperCase()}
                    <Button size="small" onClick={select}>
                        Select
                    </Button>
                    <Button size="small" onClick={remove}>
                        Remove
                    </Button>
                </Space>
            ),
            children: (
                <ActivityPanel
                    sequenceItem={item}
                    previousPosition={calc_previous_position(sequence, index)}
                    onChange={activity => update_activity(index, activity)}
                />
            )
        }
    })

    function update_preview(key) {
        dispatch(appSlice.actions.setPreview({ id: key[0], preview: true }))
    }

    function remove_all() {
        dispatch(appSlice.actions.removeAllActivities())
    }

    return (
        <StyledTile>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                    <Button size="small" onClick={exec}>
                        Execute
                    </Button>
                    <Button size="small" onClick={remove_all}>
                        Remove All
                    </Button>
                </Space>
                <Collapse
                    items={items}
                    accordion
                    bordered={false}
                    activeKey={activeKey}
                    onChange={update_preview}
                />
            </Space>
        </StyledTile>
    )
}
