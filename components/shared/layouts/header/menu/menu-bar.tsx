// components/shared/layout/header/menu/menu-bar.tsx
// Горизонтальная полоса с пунктами меню

import { MainMenuProps } from "@/types/menu.type";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";

interface MenuBarProps extends MainMenuProps {
    onSectionHover?: (sectionTitle: string | null) => void;
    activeSection?: string | null;
}

export default function MenuBar({menu, onSectionHover, activeSection}: MenuBarProps) {




    return (
        <div className="w-full flex items-end justify-center pb-0.5">
            <nav className="flex items-center">
                {menu.sections.map((section, index) => (
                    <Link key={index} href={`${section.url}`}>
                        <div
                            key={index}

                            className={`navigation-bar-text cursor-pointer hover:text-brand md:px-2 
                                        ${activeSection === section.title ? 'text-brand' : ''}`}

                            onMouseEnter={() => onSectionHover?.(section.title)}

                            onMouseLeave={() => onSectionHover?.(null)}

                        >
                            {section.title}
                        </div>
                    </Link>

                ))}
            </nav>
        </div>
    );
}