import { useEffect, useState } from "react";

interface IHasScrollbar
{
    elementRef: React.RefObject<HTMLElement>;
}

/**
 * Determines if a given element has a scrollbar or not.
 * 
 * @param {React.RefObject<HTMLElement>} elementRef - The main element to be observed and compared.
 * @returns {{ hasScroll: boolean }} Whether or not the given element has a scrollbar.
 */
export function useHasScrollbar({ elementRef }: IHasScrollbar): { hasScroll: boolean }
{
    const [hasScroll, setHasScroll] = useState<boolean>(false);

    useEffect(() =>
    {
        const element = elementRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(
            () => setHasScroll(element.scrollHeight > element.clientHeight)
        );

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [elementRef.current])

    return { hasScroll };
}