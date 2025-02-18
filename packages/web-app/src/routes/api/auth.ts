interface RegistrationData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export async function registerUser(data: RegistrationData) {
    const response = await fetch('/api/collections/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include' // Important for cookie handling
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
}
