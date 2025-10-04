// app/contacto/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

const contactSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre es demasiado largo'),
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('Por favor, introduce un email válido'),
    asunto: z
        .string()
        .min(3, 'El asunto debe tener al menos 3 caracteres')
        .max(100, 'El asunto es demasiado largo'),
    mensaje: z
        .string()
        .min(10, 'El mensaje debe tener al menos 10 caracteres')
        .max(1000, 'El mensaje es demasiado largo'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Datos del formulario:', data);

            setSubmitSuccess(true);
            reset();

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center uppercase">
                        Contacto
                    </h1>
                    <p className="text-lg text-gray-600">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="main-wrapper m-0 p-0 mx-auto pb-12 bg-white">

                {/* Hero Image */}
                <div className="relative w-full aspect-[16/9]">
                    <Image
                        src="/menu/servicio/kate-joie-mkT3dXoNVTk-unsplash 1.png"
                        alt="Foto de Kate Joie en Unsplash"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Form Section */}
                <div className="pl-32 pr-32 mx-auto px-4 space-y-12">
                    <section className="mb-16">
                        <div className="bg-white p-8">
                            {submitSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 text-center font-medium">
                                        ¡Mensaje enviado con éxito! Te responderemos pronto.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="block text-sm font-semibold text-gray-900 mb-3"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        {...register('nombre')}
                                        type="text"
                                        id="nombre"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Tu nombre completo"
                                    />
                                    {errors.nombre && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.nombre.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-900 mb-3"
                                    >
                                        Email
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Asunto */}
                                <div>
                                    <label
                                        htmlFor="asunto"
                                        className="block text-sm font-semibold text-gray-900 mb-3"
                                    >
                                        Asunto
                                    </label>
                                    <input
                                        {...register('asunto')}
                                        type="text"
                                        id="asunto"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                    {errors.asunto && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.asunto.message}
                                        </p>
                                    )}
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label
                                        htmlFor="mensaje"
                                        className="block text-sm font-semibold text-gray-900 mb-3"
                                    >
                                        Mensaje
                                    </label>
                                    <textarea
                                        {...register('mensaje')}
                                        id="mensaje"
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                    {errors.mensaje && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.mensaje.message}
                                        </p>
                                    )}
                                </div>

                                {/* Botón */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                                </button>
                            </form>

                            {/* Información adicional */}
                            <div className="mt-8 bg-blue-100 p-6 rounded-lg">
                                <p className="text-blue-800 text-center">
                                    También puedes contactarnos por email:{' '}
                                    <a
                                        href="mailto:info@alexika.es"
                                        className="font-medium underline hover:text-blue-900"
                                    >
                                        info@alexika.es
                                    </a>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;