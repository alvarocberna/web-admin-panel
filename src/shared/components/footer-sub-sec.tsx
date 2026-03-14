
interface Props {
    children?: React.ReactNode
    height?: string
}

export function FooterSubSec({ children, height = '24px' }: Props){
    return(
        <div className="w-full" style={{ height }}>
            {children}
        </div>
    )
}
