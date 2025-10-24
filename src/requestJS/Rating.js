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

export async function sendSaunaRating(saunaId, rating) {
    const headers = getAuthHeaders();

    return await axios.post(
        "http://tytsauna.loc:8080/api/saunas/rate",
        { sauna_id: saunaId, rating: rating },
        { headers }
    );
}