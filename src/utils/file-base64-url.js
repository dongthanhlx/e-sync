export function get_base64_url(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {resolve(reader.result)};
        reader.onerror = () => {reject('Cannot produce base64 url!')};
        reader.readAsDataURL(file);
    });
}