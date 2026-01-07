"use client"
//react
import { useEffect, useState } from "react";
import Link from "next/link";
//shared
import { ContenedorAdmin, TitleSec, ContSubSec } from "@/shared";
//features
import { ActividadService, ActividadEntity } from "@/features";

export default function ActividadPage() {
	const [actividades, setActividades] = useState<ActividadEntity[]>([]);

	useEffect(() => {
		const fetchActividad = async () => {
			try {
				const data = await ActividadService.getActividadAll();
				setActividades(data || []);
			} catch (error) {
				console.error("Error obteniendo actividad:", error);
			}
		};
		fetchActividad();
	}, []);

	const listaActividad = actividades.map((actividad) => {
		const fecha = new Date(actividad.fecha);
		const anno = fecha.getFullYear();
		const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
		const dia = fecha.getDate().toString().padStart(2, "0");

		return (
			<div className="w-full mb-1" key={actividad.id}>
				<div className="w-full flex border-b border-b-gray-400 text-gray-800 px-2 pb-1">
                    <p className="me-10">
                        {dia}/{mes}/{anno}
                    </p>
                    <p>
                        Articulo "{actividad.titulo_articulo}" {actividad.accion} por {actividad.usuario.nombre} {actividad.usuario.apellido}.
                    </p>
	
				</div>
			</div>
		);
	});

	return (
		<ContenedorAdmin>
			<TitleSec title="Actividad" />
			{/* <ContSubSec> */}
				<div className="flex flex-col justify-start pt-5 pb-10">
					{listaActividad}
					{actividades.length === 0 && (
						<div className="px-2 text-gray-600">No hay actividad registrada.</div>
					)}
				</div>
			{/* </ContSubSec> */}
		</ContenedorAdmin>
	);
}
