const div = document.createElement('div');

export function htmlEntityDecode(string) {
    try {
        div.innerHTML = string;
        return div.innerText;
    } catch (err) {
        console.error(err);
        return '';
    }
}