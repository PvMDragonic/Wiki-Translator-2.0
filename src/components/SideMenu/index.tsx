import { useEffect, useRef } from "react";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";

interface ISideMenu
{
    children: React.ReactNode;
    buttonRef: React.RefObject<HTMLButtonElement>;
    showSideMenu: boolean;
    setShowSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Renders the a side-menu section, that houses other components.
 *
 * @component
 * @param {ISideMenu} props - The properties object for the component.
 * @param {JSX.Element} props.children - Whatever will be rendered inside the side-menu.
 * @param {boolean} props.showSideMenu - Whether or not the side-menu is open/displayed.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setTranslation - A function to update the side-menu state.
 * @returns {JSX.Element} The rendered side-menu component.
 */
export function SideMenu({ children, buttonRef, showSideMenu, setShowSideMenu }: ISideMenu): JSX.Element
{
    const sectionRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const { hasScroll } = useHasScrollbar({ elementRef: sectionRef });

    useEffect(() => 
    {
        // Closes the <SideMenu> when a click happens outside of it.
        function handleClickOutside(event: MouseEvent)
        {
            const section = sectionRef.current;
            const button = buttonRef.current;
            if (!section || !button) return;

            if (!section.contains(event.target as Node) && !button.contains(event.target as Node))
                setShowSideMenu(false);
        }
    
        document.addEventListener("click", handleClickOutside);
    
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() =>
    {
        window.addEventListener('touchstart', (event: TouchEvent): void => 
        {
            const touch = event.touches[0];
            touchStartX.current = touch.clientX;
            touchStartY.current = touch.clientY;
        });
    
        window.addEventListener('touchend', (event: TouchEvent): void => 
        {
            const touch = event.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
    
            // Calculate the horizontal distance and vertical distance of the swipe.
            const deltaX = endX - touchStartX.current!;
            const deltaY = endY - touchStartY.current!;
    
            const minSwipeDistance = 100;
    
            // Handles the closing of the popup windows by a swipe-to-close motion on mobile.
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) 
                setShowSideMenu(false);
        });
    }, []);
    
    const showNotShow = showSideMenu ? 'show' : 'hide';
    const scrollNoScroll = hasScroll ? 'scroll' : 'no-scroll';
    const sectionClass = `side-menu side-menu--${showNotShow} side-menu--${scrollNoScroll}`;

    return (
        <section 
            ref = {sectionRef}
            className = {sectionClass}
        >
            {children}
        </section>
    )
}