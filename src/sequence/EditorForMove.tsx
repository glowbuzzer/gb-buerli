import { Quaternion, Vector3 } from "three"
import { EditRotation } from "./EditRotation"
import { EditTranslation } from "./EditTranslation"
import { styled } from "styled-components"
import { useDispatch } from "react-redux"
import { ActivitySequenceItem, appSlice } from "../store"
import { PrecisionInput } from "./PrecisionInput"
import { clone } from "../util"
import { CartesianPosition } from "@glowbuzzer/store"

const StyledEditor = styled.div`
    .grid {
        display: grid;
        width: 100%;
        grid-template-columns: auto 2fr 2fr 2fr 1fr;
        gap: 8px;
        margin-bottom: 8px;

        .input {
            text-align: right;
        }
    }
`

type EditorForMoveProps = {
    item: ActivitySequenceItem
    targetPosition: CartesianPosition
    previousPosition: CartesianPosition
    onChangeTranslation: (value: Vector3) => void
    onChangeQuaternion: (value: Quaternion) => void
}

// Provides panel to edit properties of a move
export const EditorForMove = ({
    item,
    targetPosition: position,
    previousPosition,
    onChangeTranslation,
    onChangeQuaternion
}: EditorForMoveProps) => {
    const dispatch = useDispatch()

    const translation = new Vector3().copy(position.translation as any)
    const rotation = new Quaternion().copy(position.rotation as any)

    const previousRotation = new Quaternion().copy(previousPosition.rotation as any)

    function update_item(update) {
        const updated: ActivitySequenceItem = {
            ...clone(item),
            ...update
        }
        dispatch(appSlice.actions.updateActivity(updated))
    }

    return (
        <StyledEditor>
            <div className="grid">
                <EditTranslation
                    title="Position"
                    translation={translation}
                    onChange={onChangeTranslation}
                />
                <EditRotation
                    title={"Orientation"}
                    selection={item.selection}
                    translation={translation}
                    rotation={rotation}
                    previousRotation={previousRotation}
                    onChange={onChangeQuaternion}
                />
                Approach
                <div className="input">
                    A{" "}
                    <PrecisionInput
                        value={item.approach || 0}
                        onChange={approach => update_item({ approach })}
                        step={25}
                        precision={0}
                    />
                </div>
                <div style={{ textAlign: "right" }}>Retreat</div>
                <div className="input">
                    R{" "}
                    <PrecisionInput
                        value={item.retreat || 0}
                        onChange={retreat => update_item({ retreat })}
                        step={25}
                        precision={0}
                    />
                </div>
            </div>
        </StyledEditor>
    )
}
