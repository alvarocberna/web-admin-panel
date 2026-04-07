
interface Props {
  children: React.ReactNode
  minHeight?: string
}

export function HeadSubSec({ children, minHeight = '72px' }: Props){
    return(
        <div
          className="w-full flex justify-between items-center"
          style={{ minHeight }}
        >
            {children}
        </div>
    )
}
