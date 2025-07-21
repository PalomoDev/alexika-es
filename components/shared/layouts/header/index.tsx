import { cn } from "@/lib/utils";

interface HeaderProps {
    className?: string;
}

const Header = async ({ className }: HeaderProps) => {
    return (
        <div className={cn('header', className)}>
            <header>
                Header
            </header>
        </div>
    )
}

export default Header