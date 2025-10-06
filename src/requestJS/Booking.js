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
        body: JSON.stringify({ bookings }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при бронировании');
            }
            return true;
        });
}

export async function fetchBookingsByDate(date, saunaId) {
    const response = await fetch(`http://tytsauna.loc:8080/api/bookDateInfo?date=${date}&sauna_id=${saunaId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Ошибка загрузки бронирований');
    }

    const data = await response.json();
    return data.bookings;
}

export async function getProfileBooking() {
    const response = await fetch(`http://tytsauna.loc:8080/api/profile/saunas`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Ошибка загрузки бронирований');
    }

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
