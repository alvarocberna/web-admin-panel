import { ArticulosService, ArticuloPublic } from '@/features/project';

export default async function ArticulosPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const [articulo] = await Promise.all([
        ArticulosService.getArticuloBySlug(slug)
    ])
    
    return (
        <div className="flex flex-col">
            <ArticuloPublic dataArticulo={articulo} />
        </div>
    );
}
