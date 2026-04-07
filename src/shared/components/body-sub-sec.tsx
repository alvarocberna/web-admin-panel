interface Props {
    children: React.ReactNode
}

export function BodySubSec({ children }: Props){
    return(
        <div className="w-full flex flex-col justify-center items-center">
            {children}
        </div>
    )
}
