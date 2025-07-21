import Link from "next/link";
import Logo from "@/components/shared/logo";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full p-8">
            <div className="flex flex-col gap-8 items-center">
                <Logo orientation={'vertical'} size={'medium'}/>
                <p className="text-xs text-center font-[family-name:var(--font-geist-mono)]">
                    El sitio está en reconstrucción
                </p>

                {/* Невидимая кнопка */}
                <Link
                    href="/login"
                    className="w-20 h-8 opacity-0 cursor-default"
                    tabIndex={-1}
                >
                    &nbsp;
                </Link>
            </div>
        </div>
    );
}