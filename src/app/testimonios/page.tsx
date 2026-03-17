'use client'
import { useState, useEffect } from 'react';
import { ContenedorAdmin, TitleSec } from '@/shared';
import { TestimoniosService, TestimoniosEntity } from '@/features';
import { FormTestimonios, ListaTestimonios } from '@/features';

export default function TestimoniosPage() {
    const [testimonios, setTestimonios] = useState<TestimoniosEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonios = async () => {
            try {
                const data = await TestimoniosService.getTestimonios();
                setTestimonios(data);
            } catch (error) {
                console.error('Error obteniendo testimonios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonios();
    }, []);

    return (
        <ContenedorAdmin>
            <TitleSec title="Testimonios" />

            {loading ? (
                <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>
            ) : (
                <div className="mt-4">
                    <FormTestimonios
                        testimonios={testimonios}
                        onSaved={(t) => setTestimonios(t)}
                    />
                    {testimonios && (
                        ''
                    )}
                    <ListaTestimonios/>
                </div>
            )}
        </ContenedorAdmin>
    );
}
