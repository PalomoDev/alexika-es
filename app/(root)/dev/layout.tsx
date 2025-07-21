import Header from "@/components/shared/layouts/header";
import Footer from "@/components/shared/layouts/footer";
import Main from "@/components/shared/layouts/main";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header className="sticky top-0 z-10 bg-amber-300" />
            <Main className="flex-1 overflow-y-auto bg-brand">
                {children}
            </Main>
            <Footer className={'bg-black'}/>
        </div>
    );
}