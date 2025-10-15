import axios from 'axios';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function getNameAndAvatar() {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://tytsauna.loc:8080/api/nameAndAvatar`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
    if (response.ok) {
        return {
            success: true,
            user: data,
        };
    } else {
        return {
            success: false,
            message: data.message || 'Ошибка при загрузке данных пользователя',
        };
    }
}

export async function getUserProfileInfo() {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://tytsauna.loc:8080/api/profileInfo`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
    if (response.ok) {
        return {
            success: true,
            user: data,
        };
    } else {
        return {
            success: false,
            message: data.message || 'Ошибка при загрузке данных пользователя',
        };
    }
}

export async function getUserProfile4Admin(userId) {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://tytsauna.loc:8080/api/profileInfo4Admin/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();
    if (response.ok) {
        return {
            success: true,
            user: data,
        };
    } else {
        return {
            success: false,
            message: data.message || 'Ошибка при загрузке данных пользователя',
        };
    }
}