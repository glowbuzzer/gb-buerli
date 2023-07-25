import { useAppState } from "../store"
import { StyledSelectionInfo } from "./StyledSelectionInfo"
import { SelectedObjectInfoRow } from "./SelectedObjectInfoRow"
import { useSelected } from "./SelectionProvider"

export const PanelForLine = () => {
    const selected = useSelected()

    return (
        <div>
            <StyledSelectionInfo>
                <SelectedObjectInfoRow title="Start" data={selected.start} />
                <SelectedObjectInfoRow title="End" data={selected.end} />
            </StyledSelectionInfo>
        </div>
    )
}
