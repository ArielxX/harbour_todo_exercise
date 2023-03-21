import { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TODOS',
  description: 'My TODO list app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-800">
      <body>
          <Link href="/">
            <button className="btn btn-square btn-accent m-7 p-10">
              Home
            </button>
          </Link>
        <main>
          
          {children}</main>
      </body>
    </html>
  );
}
