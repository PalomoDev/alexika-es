// components/shared/layout/header/menu/menu-bar.tsx
// Горизонтальная полоса с пунктами меню

import { MainMenuProps } from "@/types/menu.type";

interface MenuBarProps extends MainMenuProps {
    onSectionHover?: (sectionTitle: string | null) => void;
    activeSection?: string | null;
}

export default function MenuBar({menu, onSectionHover, activeSection}: MenuBarProps) {

    const handlerMouseEnter = () => {

        onSectionHover?.(null)
    }
    const handlerMouseLeave = () => {

        onSectionHover?.(null)
    }


    return (
        <div className="w-full flex items-end justify-center pb-0.5">
            <nav className="flex items-center">
                {menu.sections.map((section, index) => (
                    <div
                        key={index}
                        className={`
               navigation-bar-text hover:text-brand md:px-2 
              ${activeSection === section.title ? 'text-brand' : ''}
            `}
                        // onMouseEnter={() => onSectionHover?.(section.title)}
                        onMouseEnter={handlerMouseEnter}
                        // onMouseLeave={() => onSectionHover?.(null)}
                        onMouseLeave={handlerMouseLeave}
                    >
                        {section.title}
                    </div>
                ))}
            </nav>
        </div>
    );
}