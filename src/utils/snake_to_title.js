export function snake_to_title(snake_case) {
    if (typeof snake_case === 'string') {
        return snake_case.split('_').map(w => `${(w[0] || '').toUpperCase()}${w.slice(1)}`).join(' ');
    } else {
        return '';
    }
}