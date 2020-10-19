import {http_upload_file} from './senders/sender';

export function upload_static(file) {
    const route = `/static`;
    return http_upload_file(route, file);
}