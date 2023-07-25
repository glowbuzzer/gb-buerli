// Helper component to render some info in a grid row. Will format Vector3 object if given, or simple name/value pair
export const SelectedObjectInfoRow = ({ title, data }) => {
    if (data?.isVector3) {
        return (
            <>
                <div>{title}</div>
                <div>
                    {data.x.toFixed(2)}, {data.y.toFixed(2)}, {data.z.toFixed(2)}
                </div>
            </>
        )
    }
    return (
        <>
            <div>{title}</div>
            <div>{data}</div>
        </>
    )
}
