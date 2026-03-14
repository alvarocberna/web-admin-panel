
interface Props {
  children: React.ReactNode
  width?: string
  widthInner?: string
  height?: string
}

export function ContSubSec({ children, width = '100%', widthInner = '90%', height = 'auto' }: Props){
    return(
        <div
          className="flex mx-auto bg-white rounded-xl mb-5 shadow-sm border border-zinc-100"
          style={{ width, height: height === 'auto' ? undefined : height }}
        >
            <div className="m-auto flex flex-col" style={{ width: widthInner }}>
                {children}
            </div>
        </div>
    )
}
