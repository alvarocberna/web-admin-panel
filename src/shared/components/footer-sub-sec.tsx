
interface Props {
    children?: React.ReactNode
    height?: string //
}

export function FooterSubSec({children, height = '25px' }: Props){
    return(
        <div className={`h-[${height}] w-full text-white`}>
            {children ? children : '-'} 
        </div>
    )
}