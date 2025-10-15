function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function getUsers() {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://tytsauna.loc:8080/api/userList`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
        return {
            success: true,
            users: data,
        };
}

export async function deleteUser(userId) {
    const token = localStorage.getItem('token');
    return await fetch(`http://tytsauna.loc:8080/api/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
}

export async function blockUser(userId) {
    const token = localStorage.getItem('token');
    return await fetch(`http://tytsauna.loc:8080/api/user/block/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
}

export async function unblockUser(userId) {
    const token = localStorage.getItem('token');
    return await fetch(`http://tytsauna.loc:8080/api/user/unblock/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
}

