// noinspection JSPotentiallyInvalidConstructorUsage

import {BuerliGeometry, useBuerli} from "@buerli.io/react";


export const Scene = () => {
    const drawing = useBuerli(state => state.drawing)

    if (!drawing.active) {
        return null
    }

    return <>
        <BuerliGeometry drawingId={drawing.active}/>
    </>
}
