/**
 * Configuración centralizada de estilo y comportamiento visual
 * de los módulos públicos de integración (articulos, equipo, servicios).
 *
 * Modificar los valores de INTEGRATION_CONFIG cambia el comportamiento
 * y estilo por defecto en todos los componentes que los consumen.
 */

export type Comportamiento = 'navegar' | 'modal';
export type EstiloDosVariantes = 'estilo1' | 'estilo2';
export type EstiloTresVariantes = 'estilo1' | 'estilo2' | 'estilo3';

export const INTEGRATION_CONFIG = {
    articulo: {
        estilo: 'estilo2' as EstiloDosVariantes,
    },
    empleado: {
        comportamiento: 'modal' as Comportamiento,
        estilo: 'estilo1' as EstiloDosVariantes,
    },
    equipo: {
        comportamiento: 'modal' as Comportamiento,
        estilo: 'estilo1' as EstiloDosVariantes,
    },
    servicio: {
        comportamiento: 'modal' as Comportamiento,
        estilo: 'estilo1' as EstiloTresVariantes,
    },
    servicios: {
        comportamiento: 'modal' as Comportamiento,
        estilo: 'estilo1' as EstiloTresVariantes,
    },
};
