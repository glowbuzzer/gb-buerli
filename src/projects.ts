type Project = {
    title?: string
    model: string
    toolIndex: number
}

/** List of projects that can be loaded */
export const projects: Project[] = [
    {
        model: "Ventil.stp",
        title: "Valve",
        toolIndex: 2
    },
    {
        model: "test_weld_bracket.STEP",
        title: "Bracket Weld",
        toolIndex: 1
    },
    {
        model: "pipe_plate.STEP",
        title: "Pipe/Plate Weld",
        toolIndex: 1
    },
    {
        model: "nema 23 to 17.STEP",
        title: "Nema",
        toolIndex: 2
    }
]
