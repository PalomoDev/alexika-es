"use client";

import { useState } from "react";
import { NavigationMenu } from "@/types/menu.type";
import MenuBar from "./menu-bar";
import MenuDropdown from "./menu-dropdown";

interface MainNavigationProps {
    menu: NavigationMenu;
}

export default function MainNavigation({ menu }: MainNavigationProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleSectionHover = (sectionTitle: string | null) => {

        setActiveSection(sectionTitle);
    };

    const handleMouseLeave = () => {

        setActiveSection(null);
    };

    const getActiveMenuSection = () => {
        if (!activeSection) return null;
        return menu.sections.find(section => section.title === activeSection) || null;
    };

    return (
        <div className={'w-full flex items-end justify-center'}>
            <div className="relative">
                <MenuBar
                    menu={menu}
                    onSectionHover={handleSectionHover}
                    activeSection={activeSection}
                />

                {/* Невидимый мостик */}
                {activeSection && (
                    <div
                        className="fixed hidden md:block md:top-[90px] lg:top-[95px]  left-0 w-screen h-20 z-40 "
                        onMouseEnter={() => {

                            setActiveSection(activeSection);
                        }}

                    />
                )}

                <MenuDropdown
                    section={getActiveMenuSection()!}
                    isVisible={!!activeSection && !!getActiveMenuSection()}
                    onMouseLeave={() => {

                        handleMouseLeave();
                    }}
                />
            </div>
        </div>
    );
}