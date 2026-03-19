'use client'
import { useState, useEffect } from 'react';
import { ContenedorAdmin, TitleSec } from '@/shared';
import { ArticulosService, ArticulosEntity, ArticuloEntity, ArticulosForm, ListaArticulos } from '@/features';

export default function ArticulosPage() {
    const [articulos, setArticulos] = useState<ArticulosEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const data = await ArticulosService.getArticulos();
                setArticulos(data);
            } catch (error) {
                console.error('Error obteniendo artículos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticulos();
    }, []);

    const handleArticulosSaved = (e: ArticulosEntity) => {
        setArticulos(e);
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
                    <ArticulosForm articulos={articulos} onSaved={handleArticulosSaved} />

                    {articulos && (
                        <ListaArticulos
                            articulos={articulos.articulo ?? []}
                            onUpdated={handleArticulosUpdated}
                        />
                    )}
                </div>
            )}
        </ContenedorAdmin>
    );
}
