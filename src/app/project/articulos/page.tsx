import { ArticulosAllPublic, ArticulosServicePublic } from '@/features';

export default async function ArticulosPage() {

    const [articulos] = await Promise.all([
        ArticulosServicePublic.getArticulos()
    ])
    
    return (
        <div className="flex flex-col">
            <ArticulosAllPublic dataArticulos={articulos} />
        </div>
    );
}
