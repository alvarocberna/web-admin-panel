
interface Props {
  children: React.ReactNode
  width?: string 
  widthInner?: string
  height?: string
}

export function ContSubSec({ children, width = '100%', widthInner = '90%', height = '100%' }: Props){
    return(
        <div className={`w-[${width}] h-[${height}] flex mx-auto bg-white rounded-[12px] mb-5 shadow`} >
            <div className={`w-[${widthInner}] m-auto flex flex-col`}>
                {children}
            </div>
        </div>
    )
}