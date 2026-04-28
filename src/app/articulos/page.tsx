'use client'
//REACT
import { useState, useEffect } from 'react';
//FEATURES
import { ArticulosEntity, ArticuloEntity, UsuarioEntity } from '@/features';
import { ArticulosService, ArticulosForm, ArticuloList } from '@/features';
import { UsuarioService } from '@/features';
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared';


export default function ArticulosPage() {
    const [articulos, setArticulos] = useState<ArticulosEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState<UsuarioEntity | null>(null);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const [data, usuarioData] = await Promise.all([
                    ArticulosService.getArticulos(),
                    UsuarioService.getUsuario().catch(() => null),
                ]);
                setArticulos(data);
                setUsuario(usuarioData);
            } catch (error) {
                console.error('Error obteniendo artículos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticulos();
    }, []);

    const handleArticulosSaved = (e: ArticulosEntity) => {
        setArticulos(prev => ({ ...e, articulo: e.articulo?.length ? e.articulo : (prev?.articulo ?? []) }));
    };

    const handleArticulosUpdated = (lista: ArticuloEntity[]) => {
        if (!articulos) return;
        setArticulos({ ...articulos, articulo: lista });
    };

    return (
        <ContenedorAdmin>
            <TitleSec title="Artículos" />

            {loading ? (
                <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>
            ) : (
                <div className="mt-4">
                    <ArticulosForm articulos={articulos} onSaved={handleArticulosSaved} rol={usuario?.rol} />

                    {articulos && (
                        <ArticuloList
                            articulos={articulos.articulo ?? []}
                            onUpdated={handleArticulosUpdated}
                            rol={usuario?.rol}
                        />
                    )}
                </div>
            )}
        </ContenedorAdmin>
    );
}
