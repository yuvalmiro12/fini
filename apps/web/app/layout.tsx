import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'פיני',
  description: 'פיני - אפליקציית ניהול כספים אישי',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ fontFamily: "'Rubik', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
