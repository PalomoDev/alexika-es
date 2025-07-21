import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface MainProps {
    children: ReactNode;
    className?: string;
}

const Main = async ({ children, className }: MainProps) => {
    return (
        <main className={cn('main', className)}>
            {children}
        </main>
    )
}

export default Main