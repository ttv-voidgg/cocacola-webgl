import "./globals.css";
import { MainCanvas } from "./components/three/mainCanvas";
import NavBar from "./components/ui/navBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='antialiased font-cocacola'
      >
        {/* <NavBar /> */}
        {children}
        <MainCanvas/>
      </body>
    </html>
  );
}
