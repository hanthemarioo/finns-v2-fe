'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from "next/link";
import { useState } from "react";
import Button from '@/components/form/Button';
import { Input } from '@/components/form/Input';

type FormDataType = {
    email: string;
    password: string;
}

export default function LoginForm() {
    const [formData, setFormData] = useState<FormDataType>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            console.log('Login berhasil');
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }

        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <p className="text-xl font-semibold text-center mb-6 text-gray-900">Si Ternak</p>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Alamat Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            error={!formData.email && error ? 'Email wajib diisi' : ''}
                            placeholder='Email'
                        />
                        <Input
                            label="Kata Sandi"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            error={!formData.password && error ? 'Password wajib diisi' : ''}
                            autoComplete='password'
                            placeholder='●●●●●●●●'
                        />
                        <Button type="submit" text={loading ? 'Login...' : 'Masuk'} disabled={loading} />
                        <p className="text-sm font-medium text-gray-600">
                            Belum punya akun?
                            <Link
                                href="/register"
                                className="text-blue-600 underline ms-1"
                            >Daftar disini</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
