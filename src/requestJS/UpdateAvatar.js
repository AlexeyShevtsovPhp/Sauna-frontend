/**
 * Функция для загрузки нового аватара
 * @param {File} file - файл с изображением
 * @returns {Promise<string>} - URL нового аватара
 */
export function refreshHeader(file) {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('avatar', file);

    return fetch('http://tytsauna.loc:8080/api/refreshNameAndAvatar', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Ошибка при загрузке аватара');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.avatar) {
                return data.avatar;
            } else {
                throw new Error('Ошибка: Сервер не вернул URL аватара');
            }
        })
        .catch((error) => {
            console.error('Ошибка при загрузке аватара:', error);
            throw error;
        });
}
