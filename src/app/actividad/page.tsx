"use client"
import { useEffect, useState } from "react";
import { ContenedorAdmin, TitleSec } from "@/shared";
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

	const formatFecha = (fechaStr: string) => {
		const fecha = new Date(fechaStr);
		return fecha.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<ContenedorAdmin>
			<TitleSec title="Historial de actividad" />
			<div className="card overflow-hidden">
				{actividades.length === 0 ? (
					<div className="px-6 py-12 text-center text-zinc-400 text-sm">
						No hay actividad registrada.
					</div>
				) : (
					<div className="divide-y divide-zinc-100">
						{actividades.map((actividad) => (
							<div key={actividad.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-zinc-50 transition-colors duration-100">
								<span className="text-xs text-zinc-400 font-mono pt-0.5 flex-shrink-0 w-28">
									{formatFecha(actividad.fecha)}
								</span>
								<p className="text-sm text-zinc-700 leading-snug">
									Artículo{' '}
									<span className="font-medium text-zinc-900">
										&ldquo;{actividad.titulo_articulo}&rdquo;
									</span>{' '}
									{actividad.accion} por{' '}
									<span className="font-medium text-zinc-800">
										{actividad.usuario.nombre} {actividad.usuario.apellido}
									</span>
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</ContenedorAdmin>
	);
}
