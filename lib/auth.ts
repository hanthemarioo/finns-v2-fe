export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
export const API_PREFIX = '/api/v1';

function setCookie(name: string, value: string, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, val] = current.split('=');
        acc[key] = val;
        return acc;
    }, {} as Record<string, string>);

    return cookies[name] ? decodeURIComponent(cookies[name]) : null;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const getCsrfToken = async () => {
    const res = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Gagal mengambil CSRF token');
    }
};

export const login = async (email: string, password: string) => {
    await getCsrfToken();

    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login gagal');
    }

    const data = await res.json();

    // console.log([data, { user: JSON.stringify(data.user) }]);
    // return

    setCookie('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user))
};

export const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    await getCsrfToken();

    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
    });


    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registrasi gagal');
    }

    return await res.json();
};

export const logout = async () => {
    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json',
        },
    });
    console.log(await res.json());

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal Logout');
    }

    deleteCookie('token');
    localStorage.removeItem('user');
    // return await res.json();
};
