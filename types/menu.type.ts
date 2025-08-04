export type SubMenuItem = {
  name: string;
  href: string;
  image?: string;
  alt?: string;
  description?: string;
}


export type UniversalMenuItem = {
  name: string;
  href: string;
  image?: string;
  alt?: string;
  description?: string;
  submenu?: SubMenuItem[];
};

export type MenuSection = {
  title: string;
  displayType: "text-list" | "image-grid" | "cards";
  items: UniversalMenuItem[];
};

export type NavigationMenu = {
  sections: MenuSection[];
};

export interface MainMenuProps {
  menu: NavigationMenu;
}

export interface FooterMenuItem {
  name: string;
  href: string;
}

export interface FooterMenuCategory {
  title: string;
  items: FooterMenuItem[];
}