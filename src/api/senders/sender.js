import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

function handleResponse(res) {
    if (!res.data) {
        return Promise.reject('Something went wrong');
    } else {
        if (res.data.success) {
            return Promise.resolve(res.data.data);
        } else {
            return Promise.reject(res.data.message);
        }
    }
}

export function http_get(route) {
    let url = `${API_BASE_URL}${route}`;
    return axios.get(url).then(handleResponse);
}

export function http_post(route, payload) {
    let url = `${API_BASE_URL}${route}`;
    return axios.post(url, payload).then(handleResponse);
}

export function http_put(route, payload) {
    let url = `${API_BASE_URL}${route}`;
    return axios.put(url, payload).then(handleResponse);
}

export function http_delete(route) {
    let url = `${API_BASE_URL}${route}`;
    return axios.delete(url).then(handleResponse);
}

export function http_upload_file(route, file) {
    let url = `${API_BASE_URL}${route}`;
    const headers = {'Content-Type': 'multipart/form-data'};
    const form_data = new FormData();
    form_data.append('file', file);
    return axios.post(url, form_data, {headers}).then(handleResponse);
}