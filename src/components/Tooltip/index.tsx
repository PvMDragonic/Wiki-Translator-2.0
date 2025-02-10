import { useEffect, useRef } from "react";

interface ITooltip
{
    text: string;
    addendum?: string;
    parentRef: React.RefObject<HTMLElement>;
}

/**
 * Renders a tooltip right below (or above, if not enough space) the cursor.
 *
 * @component
 * @param {ITooltip} props - The properties object for the component.
 * @param {string} props.text - The text to be displayed on the tooltip.
 * @param {string} props.addendum - (Optional) additional text to be displayed about the tooltip.
 * @param {React.RefObject<HTMLElement>} props.parentRef - A useRef reference to the direct parent of the tooltip target.
 * @returns {JSX.Element} The rendered tooltip.
 */
export function Tooltip({ text, addendum, parentRef }: ITooltip): JSX.Element
{
    const tooltipRef = useRef<HTMLDivElement>(null);

    function toolTipPosition(mouseY: number, containerHeight: number): number 
    {
        // Places the tooltip atop the cursor if it blows the clientHeight.
        if (mouseY + containerHeight + 60 > window.innerHeight)
            return mouseY - 70;
    
        // Places it below below the cursor.
        return mouseY + 25;
    }

    useEffect(() => 
    {
        const parent = parentRef.current;
        if (!parent) return;

        const handleMouseMove = (event: MouseEvent) =>
        {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;

            // Targets the <li> holding the <OptionOptionsEntry>.
            const containerRect = (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()!;
            const containerHeight = containerRect.height;
            
            // Calculates the position inside the hovered element.
            const mouseX = event.clientX - containerRect.left;
            const mouseY = event.clientY + 5;

            // Places the tooltip center under the cursor.
            const tooltipX = mouseX - tooltip.offsetWidth! / 2.75;
            const tooltipY = toolTipPosition(mouseY, containerHeight);

            // Skipping re-render is more performant for this use-case.
            tooltip.style.left = tooltipX + 'px';
            tooltip.style.top = tooltipY + 'px';
        };

        parent.addEventListener('mousemove', handleMouseMove);

        return () => parent.removeEventListener('mousemove', handleMouseMove);
    }, [parentRef.current]);

    return (
        <div 
            ref = {tooltipRef}
            className = "tooltip"
            style = {{
                ...(text.startsWith('😡') && { fontSize: '2rem' })
            }}
        >
            {text}
            {addendum && (
                <>
                    <br/>
                    <span className = "tooltip__addendum">
                        {addendum}
                    </span>
                </>
            )}
        </div>
    )
}