interface Props {
    children: React.ReactNode
    width?: string
}

export function BodySubSec({children, width = '100%'}: Props){
    return(
        <div className={`w-[${width}] flex flex-col justify-center items-center`}>
            {children}
        </div>
    )
}