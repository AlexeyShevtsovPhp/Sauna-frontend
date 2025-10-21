import axios from 'axios';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saunaInfo(id) {
    return axios.get(`http://tytsauna.loc:8080/api/saunaInfo/${id}`, {
        headers: getAuthHeaders(),
    });
}

export function saunaCoordinates(id) {
    return axios.get(`http://tytsauna.loc:8080/api/coordinates/${id}`, {
        headers: getAuthHeaders(),
    });
}