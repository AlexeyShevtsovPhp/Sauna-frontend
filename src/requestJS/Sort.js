import axios from "axios";

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        } : {};
}

export function getSortedSaunas(sortBy = name) {
    return axios.get(`http://tytsauna.loc:8080/api/saunas/sort?sortBy=${sortBy}`, {
        headers: getAuthHeaders(),
    });
}
