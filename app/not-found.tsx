import Logo from "@/components/shared/logo";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
            <Logo size={'large'}/>
            <h1 className="text-6xl sm:text-7xl lg:text-[256px] font-extrabold text-brand-hover mt-12"
                style={{ fontSize: "164px" }}>404</h1>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Página no encontrada
            </h2>
            <p className="mt-12 max-w-md text-base text-gray-600 sm:text-lg">
                Lo sentimos, la página que buscas no existe o fue movida.
            </p>

            <Link href="/" passHref>
                <Button

                    variant="default"
                    asChild
                    className="bg-brand-hover hover:bg-brand-hover-dark text-white mt-8"
                >
                    <span>Volver a la página principal</span>
                </Button>
            </Link>
        </main>
    );
}