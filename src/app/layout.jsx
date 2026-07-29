import "./globals.css";
import { FarmProvider } from "@/context/farm-context";
export const metadata = {
    title: "CropNexa — Companion Planting Advisory",
    description: "Mobile-first companion planting advisory app for farmers with real-time weather & stage intelligence.",
    manifest: "/manifest.json",
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
        <link rel="apple-touch-icon" href="/icons/icon-192.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 select-none font-sans" suppressHydrationWarning>
        <FarmProvider>{children}</FarmProvider>

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('PWA ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `
        }}/>
      </body>
    </html>);
}
