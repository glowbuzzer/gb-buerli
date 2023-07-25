import { StyledSelectionInfo } from "./StyledSelectionInfo"
import { SelectedObjectInfoRow } from "./SelectedObjectInfoRow"
import { useSelected } from "./SelectionProvider"

export const PanelForCylinder = () => {
    const selected = useSelected()

    return (
        <div>
            <StyledSelectionInfo>
                <SelectedObjectInfoRow title="Origin" data={selected.origin} />
                <SelectedObjectInfoRow title="Radius" data={selected.radius.toFixed(2)} />
                <SelectedObjectInfoRow title="Height" data={selected.height.toFixed(2)} />
            </StyledSelectionInfo>
        </div>
    )
}
