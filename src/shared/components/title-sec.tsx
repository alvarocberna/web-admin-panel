
interface Props{
    title: string
    width?: string
}

export function TitleSec({title, width = '100%'}: Props){
    return(
        <div className={`width-[${width}] mb-10`}>
            <h1 className="text-3xl font-bold text-[#414141]">{title}</h1>
        </div>
    )
}