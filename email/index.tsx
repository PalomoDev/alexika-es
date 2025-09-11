'use server'
import { Resend } from 'resend'
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import EmailVerification from "@/emails/email-verification";

import {UserEmail} from "@/lib/validations/user/user-email";



if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY no está definida');
}

const resend = new Resend(process.env.RESEND_API_KEY as string)



export const sendVerificationEmail = async ({ user }: { user: UserEmail }) => {

    const result = await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: user.email,
        subject: `Confirma tu dirección de correo electrónico - ${APP_NAME}`,
        react: <EmailVerification user={user} />,
    });
    console.log('Result:', result);
};