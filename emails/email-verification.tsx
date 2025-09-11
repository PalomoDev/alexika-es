// 2. Email Template actualizado: email/email-verification.tsx
import { Html, Head, Body, Container, Heading, Text, Button, Hr } from "@react-email/components";

import { generateEmailVerificationToken } from '@/email/token-validation';

import {UserEmail} from "@/lib/validations/user/user-email";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const mockUser: UserEmail = {
    id: "123",
    name: "Juan Pérez",
    email: "juan@ejemplo.com"
};

export default function EmailVerification({ user=mockUser }: { user: UserEmail }) {
    const token = generateEmailVerificationToken(user.email);
    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '20px' }}>
                    <Heading style={{ color: '#333', textAlign: 'center' }}>
                        ¡Confirma tu dirección de correo electrónico!
                    </Heading>

                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        Hola {user.name},
                    </Text>

                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        Gracias por registrarte. Para completar tu registro, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:
                    </Text>

                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                        <Button
                            href={verificationUrl}
                            style={{
                                backgroundColor: '#007cba',
                                color: 'white',
                                padding: '12px 24px',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                display: 'inline-block'
                            }}
                        >
                            Confirmar Email
                        </Button>
                    </div>

                    <Text style={{ fontSize: '14px', color: '#777' }}>
                        O copia y pega este enlace en tu navegador:
                    </Text>
                    <Text style={{ fontSize: '12px', color: '#777', wordBreak: 'break-all' }}>
                        {verificationUrl}
                    </Text>

                    <Hr />

                    <Text style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                        Este enlace es válido por 24 horas. Si no solicitaste este correo, puedes ignorarlo.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}