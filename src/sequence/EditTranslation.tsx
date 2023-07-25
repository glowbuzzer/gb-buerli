import { Vector3 } from "three"
import { PrecisionInput } from "./PrecisionInput"

type EditTranslationProps = {
    title: string
    translation: Vector3
    onChange: (value: Vector3) => void
}

// Provide a panel to edit the target translation of a move.
export const EditTranslation = ({ title, translation, onChange }: EditTranslationProps) => {
    function update_translation(update: { [p: string]: number }) {
        onChange(
            new Vector3().copy({
                ...translation,
                ...update
            } as any)
        )
    }

    return (
        <>
            <div>{title}</div>
            <>
                {" "}
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={axis}>
                        {axis.toUpperCase()}{" "}
                        <PrecisionInput
                            value={translation[axis]}
                            onChange={v =>
                                update_translation({
                                    [axis]: v
                                })
                            }
                            precision={0}
                        />
                    </div>
                ))}
            </>
            <div />
        </>
    )
}
