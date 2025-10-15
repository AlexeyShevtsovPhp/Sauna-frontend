export async function login(name, password) {
    const data = { name, password };

    const response = await fetch('http://tytsauna.loc:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.name);
        localStorage.setItem('email', result.user.email);
        localStorage.setItem('role', result.user.role);
        localStorage.setItem('user_id', result.user.id.toString());

        return { success: true, status: response.status };
    } else {
        return { success: false, status: response.status };
    }
}
