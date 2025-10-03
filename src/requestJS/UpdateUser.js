export function updateUser(data) {
    const token = localStorage.getItem('token');
    return fetch('http://tytsauna.loc:8080/api/user/update', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.status === 204) return null;
            return Promise.reject('Ошибка при обновлении профиля');
        })
        .catch(console.error);
}
