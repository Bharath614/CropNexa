import "./globals.css";
import { FarmProvider } from "@/context/farm-context";
export const metadata = {
    title: "CropNexa — Companion Planting Advisory",
    description: "Mobile-first companion planting advisory app for farmers with real-time weather & stage intelligence.",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/logo.png", type: "image/png" },
            { url: "/favicon.ico" }
        ],
        shortcut: "/logo.png",
        apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "CropNexa"
    }
};
export const viewport = {
    themeColor: "#0B0F19",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="icon" type="image/png" href="/logo.png"/>
        <link rel="shortcut icon" href="/logo.png" type="image/png"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 select-none font-sans" suppressHydrationWarning>
        <FarmProvider>{children}</FarmProvider>

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(e) { console.log('SW notice:', e); });
                  });
                }
              } catch(e) {}
            `
        }}/>
      </body>
    </html>);
}
