'use client';

import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import Link from "next/link";
import { useState } from "react";
import { Input } from '@/components/form/Input';
import Button from '@/components/form/Button';

type FormDataType = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<FormDataType>({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await register(formData.name, formData.email, formData.password, formData.password_confirmation);
            console.log('Registrasi berhasil:', data);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <p className="text-xl font-semibold text-center mb-6 text-gray-900">Si Ternak</p>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <Input
                                label="Nama"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                error={!formData.name && error ? 'Nama wajib diisi' : ''}
                                placeholder='Nama Lengkap'
                            />
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
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                error={!formData.password && error ? 'Password wajib diisi' : ''}
                                autoComplete='password'
                                placeholder='Password'
                            />
                            <Input
                                label="Konfirmasi Password"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                error={!formData.password_confirmation && error ? 'Password wajib diisi' : ''}
                                autoComplete='password_confirmation'
                                placeholder='Password'
                            />
                            <Button type="submit" text='Daftar' />
                            <p className="text-sm font-medium text-gray-600">
                                Sudah punya akun?
                                <Link
                                    href="/login"
                                    className="text-blue-600 underline ms-1"
                                >Masuk disini</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}