
interface Props {
  children: React.ReactNode
  width?: string 
  minHeight?: string
}

export function HeadSubSec({ children, width = '100%', minHeight = '80px' }: Props){
    return(
        <div className={`w-[${width}] flex justify-between items-center`}
                style={{minHeight: minHeight}}>
            {children ? children : <p className="text-white">x</p>}
        </div>
    )
}