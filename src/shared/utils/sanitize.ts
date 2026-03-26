export function stripTags(value: string): string {
    return value.replace(/<[^>]*>/g, '').trim();
}

export function trimOnly(value: string): string {
    return value.trim();
}
