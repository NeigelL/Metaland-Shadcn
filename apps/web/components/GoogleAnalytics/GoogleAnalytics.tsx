"use client"
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}


export default function GoogleAnalytics({
    GA_ID = process.env.NEXT_PUBLIC_GA_ID
}) {
    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag('config', GA_ID, {
                page_path: pathname,
            });
        }
        console.log('Logging pageview for', pathname);
    }, [pathname, GA_ID]);

    return <>
    <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
    />
    <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                    });
                `,
            }}
        />
    </>
}