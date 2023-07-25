import { useAppState } from "../store"
import { StyledSelectionInfo } from "./StyledSelectionInfo"
import { SelectedObjectInfoRow } from "./SelectedObjectInfoRow"
import { arcStartEndAngle } from "../util"
import { radToDeg } from "three/src/math/MathUtils"
import { useSelected } from "./SelectionProvider"

export const PanelForArc = () => {
    const selected = useSelected()

    const { startAngle, endAngle } = arcStartEndAngle(selected)

    return (
        <div>
            <StyledSelectionInfo>
                <SelectedObjectInfoRow title="Center" data={selected.center} />
                <SelectedObjectInfoRow title="Radius" data={selected.radius.toFixed(2)} />
                <SelectedObjectInfoRow title="Normal" data={selected.normal} />
                <SelectedObjectInfoRow title="Start Angle" data={radToDeg(startAngle).toFixed(2)} />
                <SelectedObjectInfoRow title="End Angle" data={radToDeg(endAngle).toFixed(2)} />
            </StyledSelectionInfo>
        </div>
    )
}
