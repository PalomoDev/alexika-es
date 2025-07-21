import { cn } from "@/lib/utils";

interface HeaderProps {
    className?: string;
}
const Footer =  async ({ className }: HeaderProps) => {
    return (
        <div className={cn('footer', className)}>
            <footer>
                Footer
            </footer>
        </div>
)
}

export default Footer