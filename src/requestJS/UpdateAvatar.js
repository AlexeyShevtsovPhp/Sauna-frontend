/**
 * Функция для загрузки нового аватара
 * @param {File} file - файл с изображением
 * @returns {Promise<string>} - URL нового аватара
 */
export function refreshHeader(file) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Ошибка: Не найден токен для авторизации');
        return Promise.reject(new Error('Не найден токен для авторизации'));
    }

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
                    // Пытаемся распарсить ответ сервера и передаем его в ошибку
                    throw new Error(err.message || 'Ошибка при загрузке аватара');
                });
            }
            return response.json();
        })
        .then(data => {
            // Убедимся, что данные содержат поле avatar
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
