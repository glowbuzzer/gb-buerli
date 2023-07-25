import { styled } from "styled-components"
import { Button, Space } from "antd"
import { GraphicType } from "@buerli.io/core"
import { appSlice, useAppState } from "../store"
import { CurrentSelectionPanel } from "../selection/CurrentSelectionPanel"
import { useDispatch } from "react-redux"
import { useHistoryApiFromContext } from "../BuerliModelProvider"
import { useState } from "react"

const StyledPathBuilderTile = styled.div`
    padding: 10px;
`

const types = [
    // These are from non-exported GrT type in selectGeometry definition
    GraphicType.POINT,
    GraphicType.LINE,
    GraphicType.ARC,
    GraphicType.CIRCLE,
    GraphicType.PLANE,
    GraphicType.CYLINDER,
    GraphicType.CONE,
    GraphicType.SPHERE,
    GraphicType.NURBSCURVE,
    GraphicType.NURBSSURFACE
] as any[]

// This tile allows the user to select a geometry in the model, and displays information about the selected geometry.
// The user can then create moves using different points on the selected geometry.
export const PathBuilderTile = () => {
    const api = useHistoryApiFromContext()
    const dispatch = useDispatch()
    const { selected } = useAppState()
    const [selecting, setSelecting] = useState(false)

    async function select() {
        dispatch(appSlice.actions.clearSelection())
        dispatch(appSlice.actions.cancelPreview())
        setSelecting(true)

        try {
            const info = await api.selectGeometry(types)

            const userData = info[0].userData
            if (userData.type === "arc") {
                console.log(userData.center) // <-- subtype should be inferred by compiler
                console.log(userData.pointOnPlane) // COMPILE ERROR!
            }
            // don't want to store intersection in redux (serialization issues!)
            const { intersection, rawGraphic, ...rest } = userData
            console.log("selection", info[0])

            // HERE WE CAN GET THE INFO BACK FROM DRAWING GIVEN THE INFO FROM SELECTION (EXAMPLE)
            // const { containerId, graphicId } = info[0]
            // const i = getDrawing(drawing.active).geometry.cache[containerId].map[graphicId]
            // console.log("active drawing", drawing.active)
            // console.log("i", i)
            dispatch(appSlice.actions.setSelected(rest))
        } finally {
            setSelecting(false)
        }
    }

    function clear_selection() {
        dispatch(appSlice.actions.clearSelection())
    }

    return (
        <StyledPathBuilderTile>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                    <Button size="small" onClick={select} disabled={selecting}>
                        Select Geometry
                    </Button>
                    {selected && (
                        <Button size="small" onClick={clear_selection}>
                            Clear Selection
                        </Button>
                    )}
                </Space>
                <CurrentSelectionPanel />
            </Space>
        </StyledPathBuilderTile>
    )
}
