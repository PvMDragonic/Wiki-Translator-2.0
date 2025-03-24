import { useRef, useState } from "react";
import { Tooltip } from "@components/Tooltip";

interface IOptionOptionsButton
{
    label: string;
    tooltip: string;
    active: boolean;
    onClick: () => void;
}

/**
 * Renders a settings button for the options page.
 *
 * @component
 * @param {IOptionOptionsEntry} props - The properties object for the component.
 * @param {string} props.label - Text for the setting's label.
 * @param {string} props.tooltip - Text for the setting's tooltip.
 * @param {boolean} props.active - Condition for the button to be active or not.
 * @param {function} props.onClick - Function to be called when the button is clicked.
 * @returns {JSX.Element} The rendered label and input.
 */
export function OptionOptionsButton({ label, tooltip, active, onClick }: IOptionOptionsButton): JSX.Element
{
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const className = `options-entry__button options-entry__button--${active ? 'active' : 'inactive'}`;

    return (
        <>
            <button
                ref = {buttonRef} 
                data-title = {tooltip}
                className = {className}
                onMouseLeave = {() => setShowTooltip(false)}
                onMouseEnter = {() => setShowTooltip(true)}
                onClick = {onClick}
            >
                {label}
            </button>
            {showTooltip && (
                <Tooltip
                    text = {tooltip}
                    parentRef = {buttonRef}
                />
            )}
        </>
    )
}