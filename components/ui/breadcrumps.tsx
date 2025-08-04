'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    className?: string;
    items?: BreadcrumbItem[]; // опциональные кастомные items
}

const Breadcrumbs = ({ className = "", items }: BreadcrumbsProps) => {
    const pathname = usePathname()


    // Если переданы кастомные items, используем их
    const breadcrumbItems = items || (() => {
        const paths = pathname.split('/').filter(Boolean)

        const breadcrumbItems = [
            { label: 'INICIO', href: '/' }
        ]

        let currentPath = ''
        paths.forEach((path, index) => {
            currentPath += `/${path}`

            // Преобразование пути в читаемый текст
            const label = path
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .toUpperCase()

            // Последний элемент без href
            if (index === paths.length - 1) {
                breadcrumbItems.push({ label, href: '' })
            } else {
                breadcrumbItems.push({ label, href: currentPath })
            }
        })

        return breadcrumbItems
    })()

    return (
        <nav className={`mb-8 ${className}`} aria-label="Навигационные крошки">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 uppercase">
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="text-red-600 mr-2">•</span>
                        )}
                        {item.href && index !== breadcrumbItems.length - 1 ? (
                            <Link
                                href={item.href}
                                className="hover:text-red-600 transition-colors"
                                aria-label={`Перейти к ${item.label}`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={index === breadcrumbItems.length - 1 ? "text-red-600 font-medium" : ""}
                                aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;