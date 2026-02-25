import { Sigmar, Poppins } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/Navigation";
import type { Metadata } from "next";

const sigmar = Sigmar({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-sigmar",
});

const poppins = Poppins({
    weight: ["400", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Worrier Finance",
    description: "Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${sigmar.variable} ${poppins.variable} relative`}>
                <div className="absolute top-0 left-0 w-full z-50">
                    <Navigation />
                </div>
                {children}
            </body>
        </html>
    );
}