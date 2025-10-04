// app/register/_page.txt
import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";
import Logo from "@/components/shared/logo";
import {LoginForm} from "@/components/auth/LoginForm";
import Image from "next/image";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const photoCopyright = 'Foto de <a href="https://unsplash.com/es/@hollymandarich?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Holly Mandarich</a> en <a href="https://unsplash.com/es/fotos/mujer-bajando-la-colina-durante-el-dia-7MrXw_o7Eo4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'


export default async function RegisterPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Если сессия есть, редиректим на главную
    if (session) {
        redirect(ROUTES.PAGES.HOME)
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href={ROUTES.PAGES.HOME} className="flex items-center gap-2 font-medium">
                        <div className="flex items-center justify-center">
                            <Logo size={'small'} />
                        </div>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm/>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/unsplash_mock/holly-mandarich-7MrXw_o7Eo4-unsplash.jpg"
                    fill
                    className="object-cover object-bottom"
                    alt={photoCopyright}
                />
            </div>
        </div>
    )
}