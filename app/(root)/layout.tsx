import type { Metadata } from "next";




export const metadata: Metadata = {
    title: "Alexika de Aventura | Equipo de Montaña y Camping",
    description: "Tu destino único para equipamiento de montaña y aventura de alta calidad. Descubre nuestra selección de mochilas, tiendas de campaña, sacos de dormir y equipo técnico para senderismo, escalada y camping. Especialistas en material de montaña con más de 20 años de experiencia.",
    keywords: "equipo de montaña, material senderismo, tiendas de campaña, mochilas trekking, equipamiento outdoor, material camping, Alexika, aventura",
    openGraph: {
        title: "Alexika de Aventura | Equipo de Montaña y Camping",
        description: "Tu destino único para equipamiento de montaña y aventura de alta calidad. Especialistas en material de montaña.",
        type: "website",
        locale: "es_ES",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
        </div>

    );
}