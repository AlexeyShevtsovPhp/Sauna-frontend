function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        } : {};
}

export function sendBookings(bookings) {
    return fetch('http://tytsauna.loc:8080/api/bookings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({bookings}),
    });
}

export async function fetchBookingsByDate(date, saunaId) {
    const response = await fetch(`http://tytsauna.loc:8080/api/bookDateInfo?date=${date}&sauna_id=${saunaId}`, {
        headers: getAuthHeaders(),
    });
    return await response.json();
}

export async function getProfileBooking() {
    const response = await fetch(`http://tytsauna.loc:8080/api/profile/saunas`, {
        headers: getAuthHeaders(),
    });
    return await response.json();
}

export async function deleteBooking(bookingId) {
    const response = await fetch(`http://tytsauna.loc:8080/api/deleteBook/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Ошибка удаления бронирования');
    }

    return true;
}

export async function getProfileBooking4Admin(userId) {
    const response = await fetch(`http://tytsauna.loc:8080/api/profile/saunas/${userId}`, {
        headers: getAuthHeaders(),
    });
    return await response.json();
}

export async function blockBookings(bookings) {
    return fetch(`http://tytsauna.loc:8080/api/block`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookings),
    }).then(res => res.json());
}

export async function clearBlockedBookings(bookings) {
    return fetch(`http://tytsauna.loc:8080/api/clear-blocked`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookings),
    }).then(res => res.json());
}


