import { ArticulosAllPublic, ArticulosService } from '@/features/project';

export default async function ArticulosPage() {

    const [articulos] = await Promise.all([
        ArticulosService.getArticulos()
    ])
    
    return (
        <div className="flex flex-col">
            <ArticulosAllPublic dataArticulos={articulos} />
        </div>
    );
}
