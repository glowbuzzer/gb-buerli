import { styled } from "styled-components"
import { Button } from "antd"
import { GraphicType } from "@buerli.io/core"
import { useEffect } from "react"
import { useHistoryApiFromContext } from "./App"

const StyledPathBuilderTile = styled.div`
    padding: 10px;
`

export const PathBuilderTile = () => {
    const api = useHistoryApiFromContext()

    useEffect(() => {
        console.log("api from context", api)
    }, [api])

    async function select() {
        console.log("select")
        const info = await api.selectGeometry([GraphicType.POINT, GraphicType.PLANE])
        console.log("info", info)
    }

    return (
        <StyledPathBuilderTile>
            <Button size="small" onClick={select}>
                Make Selection
            </Button>
        </StyledPathBuilderTile>
    )
}
