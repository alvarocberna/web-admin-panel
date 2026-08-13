import { ArticulosServicePublic, ArticuloPublic } from '@/features';

export default async function ArticulosPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const [articulo] = await Promise.all([
        ArticulosServicePublic.getArticuloBySlug(slug)
    ])
    
    return (
        <div className="flex flex-col">
            <ArticuloPublic dataArticulo={articulo} />
        </div>
    );
}
