import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const getBaseUrl = () => process.env.NEXT_PUBLIC_BACKEND_CMS_URL || 'http://localhost:3001';

export async function apiFetchServer<T>(
    endpoint: string,
    method: string = 'GET',
    data?: unknown,
): Promise<T> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
    };

    const res = await fetch(`${getBaseUrl()}/${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        cache: 'no-store',
    });

    if (res.status === 401) {
        redirect('/');
    }

    if (!res.ok) {
        let errorData: { message?: string; error?: string };
        try {
            errorData = await res.json();
        } catch {
            errorData = { message: `Error HTTP ${res.status}: ${res.statusText}` };
        }
        throw new Error(errorData?.message || errorData?.error || `Error HTTP ${res.status}`);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    const text = await res.text();
    if (!text) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
}
