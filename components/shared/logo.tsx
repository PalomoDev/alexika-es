import Image from "next/image";
import React from "react";

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
    hideIcon?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

const logoSizes = {
    small: {
        icon: { width: 32, height: 32 },
        name: {
            horizontal: { width: 120, height: 20 },
            vertical: { width: 100, height: 16 }
        },
        spacingHorizontal: 'ml-1',
        spacingVertical: 'mt-1'
    },
    medium: {
        icon: { width: 33, height: 33 },
        name: {
            horizontal: { width: 210, height: 40 },
            vertical: { width: 170, height: 32 }
        },
        spacingHorizontal: 'ml-2',
        spacingVertical: 'mt-2'
    },
    large: {
        icon: { width: 80, height: 80 },
        name: {
            horizontal: { width: 320, height: 50 },
            vertical: { width: 260, height: 40 }
        },
        spacingHorizontal: 'ml-3',
        spacingVertical: 'mt-3'
    }
};

export default function Logo({
                                 size = 'medium',
                                 className = '',
                                 hideIcon = false,
                                 orientation = 'horizontal'
                             }: LogoProps) {
    const currentSize = logoSizes[size];

    const containerClasses = orientation === 'horizontal'
        ? 'flex items-center'
        : 'flex flex-col items-center gap-2';

    const nameSpacing = orientation === 'horizontal'
        ? currentSize.spacingHorizontal
        : currentSize.spacingVertical;

    const nameSize = currentSize.name[orientation];

    return (
        <div className={`w-full flex items-center justify-center ${className}`}>
            <div className={containerClasses}>
                {!hideIcon && (
                    <div
                        className="relative"
                        style={{ width: currentSize.icon.width, height: currentSize.icon.height }}
                    >
                        <Image
                            src="/svg/logo/logo-round.svg"
                            alt="Logotipo"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </div>
                )}
                <div
                    className={`relative ${hideIcon ? '' : nameSpacing}`}
                    style={{ width: nameSize.width, height: nameSize.height }}
                >
                    <Image
                        src="/svg/logo/logo-name.svg"
                        alt="Nombre de la empresa"
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}