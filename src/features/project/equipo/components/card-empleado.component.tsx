import { EmpleadoEntity } from '@/features/project';


export function CardEmpleado(emp: EmpleadoEntity){
    return(
       <div key={emp.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="card px-5 py-5 h-full flex flex-col">
                {emp.img_url && (
                    <img
                        src={emp.img_url}
                        alt={emp.img_alt}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                )}
                <p className="text-md font-semibold text-zinc-900">
                    {emp.nombre_primero}
                    {emp.nombre_segundo ? ` ${emp.nombre_segundo}` : ''}{' '}
                    {emp.apellido_paterno}
                    {emp.apellido_materno ? ` ${emp.apellido_materno}` : ''}
                </p>
                {emp.profesion && (
                    <p className="text-sm font-semibold text-zinc-900">{emp.profesion}</p>
                )}
                {emp.especialidad && (
                    <p className="text-sm font-semibold text-zinc-900">{emp.especialidad}</p>
                )}
                {emp.descripcion && (
                    <p className="text-xs text-zinc-700 mt-2 line-clamp-3">{emp.descripcion}</p>
                )}
            </div>
        </div>
    )
}