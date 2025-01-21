import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'bloguide demo',
  description: 'bloguide: blogger helper service demo. with v0',
  icons: {
    icon: "/favicon.ico"
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
