

export function ContenedorSec(
  {children, id}: Readonly<{children: React.ReactNode; id?: string;}>
) {
  return (
    <div id={id} className="w-full flex flex-col mb-20 justify-center">
            <div className='w-[90%] sm:w-[80% md:w-[90%] lg:w-[80%] h-full md:mt-8 mx-auto flex flex-col'>
              {children}
            </div>
    </div>
  )
}