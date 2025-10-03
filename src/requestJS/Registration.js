export async function registration(name, password, email) {
    const data = {
        name: name,
        password: password,
        email: email,
    };

    const response = await fetch('http://tytsauna.loc:8080/api/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.token && result.user) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.name);
        localStorage.setItem('email', result.user.email);
        localStorage.setItem('role', result.user.role);
        localStorage.setItem('user_id', result.user.id.toString());

        return {success: true, data: result};
    } else {
        return {
            success: false,
            message: result.message || 'Ошибка с регистрацией',
            errors: result.errors || null
        };
    }
}
