import './globals.css'
import Head from 'next/head';
import React from "react";
import {Nav} from '@/lib/components';

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <Head>
            <link rel="stylesheet" href="https://unpkg.com/tailwindcss@3.2.7/dist/tailwind.min.css"/>
        </Head>
        <body className="bg-gray-200">
        <Nav/>
        <main className="max-w-3xl mx-auto py-10">
            {children}
        </main>
        </body>
        </html>
    )
}
