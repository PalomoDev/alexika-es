import Header from "@/components/shared/layouts/header";
import Footer from "@/components/shared/layouts/footer";
import Main from "@/components/shared/layouts/main";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-dvh flex flex-col">
            <Header className="fixed top-0 z-10 w-full" />
            <Main className="main-wrapper">
                {children}
            </Main>
            <Footer className={''}/>
        </div>
    );
}