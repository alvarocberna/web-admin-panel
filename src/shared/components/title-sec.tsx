
interface Props {
    title: string
}

export function TitleSec({ title }: Props){
    return(
        <div className="mb-7">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h1>
        </div>
    )
}
