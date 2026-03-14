
interface Props {
  title: string
}

export function TitleSubSec({ title }: Props){
    return(
        <div className="my-auto">
            <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        </div>
    )
}
