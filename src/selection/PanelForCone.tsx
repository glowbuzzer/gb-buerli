import { StyledSelectionInfo } from "./StyledSelectionInfo"
import { SelectedObjectInfoRow } from "./SelectedObjectInfoRow"
import { useSelected } from "./SelectionProvider"

export const PanelForCone = () => {
    const selected = useSelected()

    return (
        <div>
            <StyledSelectionInfo>
                <SelectedObjectInfoRow title="Origin" data={selected.origin} />
                <SelectedObjectInfoRow title="Radius Top" data={selected.radiusTop.toFixed(2)} />
                <SelectedObjectInfoRow
                    title="Radius Bottom"
                    data={selected.radiusBottom.toFixed(2)}
                />
                <SelectedObjectInfoRow title="Height" data={selected.height.toFixed(2)} />
            </StyledSelectionInfo>
        </div>
    )
}
