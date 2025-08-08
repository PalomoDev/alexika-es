export function singularizeCategoryName(name: string): string {
    const words = name.split(' ');
    if (words.length > 0) {
        let first = words[0];
        // Очень простая логика для испанских существительных
        if (first.endsWith('es')) {
            first = first.slice(0, -2);
        } else if (first.endsWith('s')) {
            first = first.slice(0, -1);
        }
        words[0] = first;
    }
    return words.join(' ');
}