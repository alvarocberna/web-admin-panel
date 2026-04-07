
export function ContenedorPage(
  {children,}: Readonly<{children: React.ReactNode;}>
) {
  return (
    <div className="flex justify-center bg-white">
        {/* Sec Principal */}
        <div className="w-full min-h-screen flex mt-20">
            <div className='w-[90%] sm:w-[80% md:w-[90%] lg:w-[80%] h-full mt-25 md:mt-8 mb-40 mx-auto'>
              {children}
            </div>
        </div>
    </div>
  )
}