// components/shared/layout/header/menu/menu-dropdown.tsx
// Выпадающий контент с разными типами отображения

import Link from "next/link";
import Image from "next/image";
import { MenuSection, UniversalMenuItem } from "@/types/menu.type";
import {ROUTES} from "@/lib/constants/routes";

import { truncateText } from "@/lib/utils";
import {TRANCAT_MENU} from "@/lib/constants";
import React from "react";

interface MenuDropdownProps {
    section: MenuSection;
    isVisible: boolean;
    onMouseLeave?: () => void;
}

const TextList = ({ items }: { items: UniversalMenuItem[] }) => (
    <div className="flex gap-3 justify-center xl:gap-10">
        {items.map((item, index) => (
            <React.Fragment key={index}>
                <div className="flex flex-col">
                    <Link
                        href={`${ROUTES.PAGES.PRODUCTS}${item.href}`}
                        className="block pl-0 pb-0 text-gray-700 hover:text-black hover:bg-gray-50 rounded transition-colors font-medium"
                    >
                        {item.name}
                    </Link>

                    {/* Подменю если есть */}
                    {item.submenu && (
                        <div className="mt-2 space-y-1">
                            {item.submenu.map((subItem, subIndex) => (
                                <Link
                                    key={subIndex}
                                    href={`${ROUTES.BASE_URL}${subItem.href}`}
                                    className="block text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-colors"
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Вертикальный делитель */}
                {index < items.length - 1 && (
                    <div className="w-px bg-gray-300 self-stretch"></div>
                )}
            </React.Fragment>
        ))}
    </div>
);

const ImageGrid = ({ items }: { items: UniversalMenuItem[] }) => (
    <div className="flex gap-4 justify-center md:text-xs">
        {items.map((item, index) => (
            <Link
                key={index}
                href={`${ROUTES.PAGES.HOME}${item.href}`}
                className="block group"
            >
                {item.image && (
                    <div className="relative  overflow-hidden bg-gray-100 menu-image-size">
                        <Image
                            src={item.image}
                            alt={item.alt || item.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100px, (max-width: 1024px) 100px, (max-width: 1280px) 150px, 250px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <h3 className="text-white md:text-[10px] lg:text-[16px] font-bold text-center">
                                {item.name}
                            </h3>
                        </div>
                    </div>
                )}
                {item.description && (
                    <p className=" text-yellow-300 text-center">{item.description}</p>
                )}
            </Link>
        ))}
    </div>
);

const Cards = ({ items }: { items: UniversalMenuItem[] }) => (
    <div className="flex gap-4">
        {items.map((item, index) => (
            <div key={index} className="block card-size hover:bg-white" >
                <Link
                    href={item.href}
                    className=""

                >

                    {item.image && (
                        <div
                            className="relative overflow-hidden bg-gray-100 menu-image-size"

                        >
                            <Image
                                src={item.image}
                                alt={item.alt || item.name}
                                fill
                                priority
                                sizes="(max-width: 768px) 0px, (max-width: 1024px) 100px, (max-width: 1280px) 150px, 250px"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <h3 className="pt-1 font-black md:text-[10px] text-gray-900 mb-1 uppercase">{item.name}</h3>
                    {item.description && (
                        <p className=" hidden lg:block lg:text-[12px] text-ellipsis text-gray-600">{truncateText(item.description, TRANCAT_MENU)}</p>
                    )}
                </Link>
            </div>
        ))}
    </div>
);

export default function MenuDropdown({ section, isVisible, onMouseLeave }: MenuDropdownProps) {
    if (!isVisible || !section.items.length) return null;


    const renderContent = () => {
        switch (section.displayType) {
            case "text-list":
                return <TextList items={section.items} />;
            case "image-grid": {
                return <ImageGrid items={section.items} />;
            }

            case "cards":
                return <Cards items={section.items} />;
            default:
                return <TextList items={section.items} />;
        }
    };

    return (
        <div
            className="menu-dropdown"
            onMouseLeave={onMouseLeave} // Добавить этот обработчик
        >
            <div className="menu-dropdown-container ">

                {renderContent()}
            </div>
        </div>
    );
}