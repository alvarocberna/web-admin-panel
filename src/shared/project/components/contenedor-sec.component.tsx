

export function ContenedorSec(
  {children, id, background = 'transparent'}: Readonly<{children: React.ReactNode; id?: string; background?: string;}>
) {
  return (
    <div id={id} style={{ background }} className="w-full flex flex-col mb-20 justify-center">
            <div className='w-[90%] sm:w-[80% md:w-[90%] lg:w-[75%] h-full md:mt-8 mx-auto flex flex-col'>
              {children}
            </div>
    </div>
  )
}