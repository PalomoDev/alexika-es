// components/layout/Header.tsx
import React from 'react';
import Logo from "@/components/shared/logo";
import {mockNavigationMenu, oferta} from "@/db/data";
import {Oferta, HamburgerMenu } from "./HeaderElements";
import { UserButton } from "./UserButton";
import {ROUTES} from "@/lib/constants/routes";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {NavigationMenu} from "@/types/menu.type";
import MainNavigation from '@/components/shared/layouts/header/menu/main-navigation'
import Cart from "@/components/shared/layouts/header/cart";
import {getSessionCart} from "@/lib/actions/cart/cart.action";
import {SearchBlock} from "@/components/shared/layouts/header/SearchBlock";


interface HeaderProps {
    className?: string;
}



interface MenuProps {
    oferta: string
    menu: NavigationMenu
}

interface TabletDesktopMenuProps extends MenuProps {
    isDesktop: boolean
    className?: string;
}




const Header = async ({ className }: HeaderProps = {}) => {


    return (
        <header className={cn("header", className)}>
            <div className={'desktop xl:block hidden '}>
                <TabletDesktopMenu oferta={oferta} menu={mockNavigationMenu} isDesktop={true} />
            </div>
            <div className={'tablet md:block xl:hidden hidden'}>
                <TabletDesktopMenu oferta={oferta} menu={mockNavigationMenu} isDesktop={false} />
            </div>
            <div className={'mobile block md:hidden '}>
                <MobileMenu oferta={oferta} menu={mockNavigationMenu}/>
            </div>
        </header>
    );
};

const MobileMenu = ({ oferta, menu }: MenuProps) => {
    return (
        <div className={'flex flex-col justify-between '}>
            {/* Основное меню */}
            <div className="header-secondary-bar">
                <div className="header-secondary-container">
                    <div className="flex-shrink-0">
                        <Link href={ROUTES.PAGES.HOME} >
                            <Logo size={'small'} />
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <UserButton side={'bottom'} />
                        <HamburgerMenu menu={menu} />
                    </div>
                </div>
            </div>
            <div className="header-primary-bar">
                <Oferta oferta={oferta}/>
            </div>

        </div>
    );
};

const TabletDesktopMenu = async ({ oferta, menu, isDesktop, className = '' }: TabletDesktopMenuProps) => {
    const cartResponse = await getSessionCart()
    const quantityItemsCart = cartResponse?.data?.items?.reduce((total, item) => total + item.qty, 0) ?? 0;

    return (
        <div>
            {/* Оферта + User + Cart */}
            <div className={cn("header-primary-bar", className)}>
                <div className="header-primary-container">
                    <Oferta oferta={oferta}/>
                    <div className="flex flex-shrink-0 items-center gap-0">
                        <UserButton side={'right'} />
                        <Cart items={quantityItemsCart || 0} />
                    </div>
                </div>
            </div>

            {/* Основное меню */}
            <div className={cn("header-secondary-bar", className)}>
                <div className={'header-secondary-container'}>

                        <div className="flex-shrink-0">
                            <Link href={ROUTES.PAGES.HOME}>
                                <Logo size={'medium'}/>
                            </Link>
                        </div>

                        {isDesktop ? (
                            <div className={'flex  w-full justify-between '}>
                                {/* Desktop Layout */}
                                <MainNavigation menu={menu} />

                                <SearchBlock size="full" />
                            </div>
                        ) : (
                            /* Tablet Layout */
                            <div className="flex w-full justify-between">
                                <MainNavigation menu={menu} />
                                <SearchBlock size="icon"/>
                            </div>
                        )}
                    </div>

            </div>
        </div>
    );
};

export default Header;