import type { Metadata } from 'next'
import './globals.css'
import ConvexClientProvider from '../components/ConvexClientProvider'

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
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
