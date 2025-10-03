export function uploadAvatar(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    return fetch('http://tytsauna.loc:8080/api/uploadAvatar', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: formData,
    })
        .then(response => {
            if (response.status === 204) {
                // Если код ответа 204, значит аватар успешно загружен, но нет контента в ответе
                return null;
            }

            // В случае другого кода (ошибка или другие статусы) пытаемся распарсить JSON
            return response.json();
        })
        .catch(error => {
            console.error('Error during avatar upload:', error);
            // Прокидываем ошибку
            return Promise.reject('Ошибка загрузки аватара');
        });
}
