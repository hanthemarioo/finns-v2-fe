"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldTrackNavigation(anchor: HTMLAnchorElement) {
    const href = anchor.getAttribute("href");

    if (!href || href.startsWith("#")) return false;
    if (anchor.target && anchor.target !== "_self") return false;

    const nextUrl = new URL(anchor.href);

    if (nextUrl.origin !== window.location.origin) return false;
    if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return false;

    return true;
}

export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented || isModifiedClick(event)) return;

            const target = event.target;
            if (!(target instanceof Element)) return;

            const anchor = target.closest("a");
            if (!(anchor instanceof HTMLAnchorElement)) return;

            if (shouldTrackNavigation(anchor)) {
                setIsNavigating(true);
            }
        };

        window.addEventListener("click", handleClick, true);

        return () => {
            window.removeEventListener("click", handleClick, true);
        };
    }, []);

    if (!isNavigating) return null;

    return (
        <div className="fixed left-0 top-0 z-[60] h-1 w-full overflow-hidden bg-orange-100">
            <div className="h-full w-1/2 animate-pulse bg-orange-500" />
        </div>
    );
}
