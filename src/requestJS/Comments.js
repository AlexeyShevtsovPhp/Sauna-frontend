import axios from 'axios';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        } : {};
}

export const createComment = async (saunaId, commentText) => {
    const headers = getAuthHeaders();

    return await axios.post(
        `http://tytsauna.loc:8080/api/comments/${saunaId}`,
        {sauna_id: saunaId, comment: commentText},
        {headers}
    );
};

export function fetchComments(saunaId, page = 1) {
    return axios.get(`http://tytsauna.loc:8080/api/comments/get/${saunaId}`, {
        headers: getAuthHeaders(),
        params: {
            page: page,
        },
    });
}