export function saunaUpdate(data) {
    const token = localStorage.getItem('token');

    return fetch('http://tytsauna.loc:8080/api/sauna/update', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(async response => {
            console.log('[saunaUpdate] Status:', response.status);

            if (response.ok) return null;

            const errorText = await response.text(); // выведем тело ошибки
            console.error('[saunaUpdate] Error body:', errorText);

            return Promise.reject(new Error(`Ошибка: статус ${response.status}, тело: ${errorText}`));
        })
        .catch(error => {
            console.error('[saunaUpdate] Catch:', error);
            throw error;
        });
}

export async function uploadPhoto(saunaId, file) {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('sauna_id', saunaId);

    const response = await fetch('http://tytsauna.loc:8080/api/uploadSaunaPhoto', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();
    return data.url;
}


export async function deletePhotoFromServer(saunaId, photoUrl) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('saunaId', saunaId);
    formData.append('photoUrl', photoUrl);
    formData.append('_method', 'DELETE');

    const response = await fetch('http://tytsauna.loc:8080/api/deleteSaunaPhoto', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
    }
    return null;
}


