import { useRef, useState } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { Tooltip } from "@components/Tooltip";
import CheckedIcon from "@assets/CheckedIcon";

interface IOptionOptionsEntry
{
    label: string;
    lcKey: string;
    tooltip: string;
    disabled?: boolean;
    state: boolean;
    stateUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Renders a settings entry for the options page.
 *
 * @component
 * @param {IOptionOptionsEntry} props - The properties object for the component.
 * @param {string} props.label - Text for the setting's label.
 * @param {string} props.lcKey - String key to access the correct localStorage.
 * @param {string} props.tooltip - Text for the setting's tooltip.
 * @param {boolean} props.disabled - (Optional) Whether or not the setting is available.
 * @param {boolean} props.state - Whether or not the setting is active.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.stateUpdate - A function to update the setting state.
 * @returns {JSX.Element} The rendered label and input.
 */
export function OptionOptionsEntry({ label, lcKey, tooltip, disabled = false, state, stateUpdate }: IOptionOptionsEntry): JSX.Element
{
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const { saveToStorage } = useLocalStorage();

    const labelRef = useRef<HTMLLabelElement>(null);

    const actualInputClass = `options-entry__input options-entry__input--${state ? 'active' : 'inactive'}`;

    function handleUpdate()
    {
        stateUpdate(prev => 
        {
            const newState = !prev;
            saveToStorage(lcKey, newState);
            return newState;
        })
    }

    return (
        <>
            <div 
                className = "options-entry__label-container"
                style = {{ ...(disabled && { opacity: '50%' }) }}
            >
                <label 
                    ref = {labelRef}
                    htmlFor = {label}
                    className = "options-entry__label"
                    onMouseEnter = {() => setShowTooltip(true)}
                    onMouseLeave = {() => setShowTooltip(false)}
                    style = {{ ...(!disabled && { cursor: 'pointer' }) }}
                >
                    {label}
                </label>
            </div>
            <div className = "options-entry__input-container">
                <input
                    id = {label}
                    type = "checkbox" 
                    className = "options-entry__accessibility-input"
                    disabled = {disabled}
                    onChange = {handleUpdate}
                />                
                <div
                    className = {actualInputClass}
                    onClick = {handleUpdate}
                    style = {{ ...(disabled && { 
                        pointerEvents: 'none',
                        opacity: '50%' 
                    }) }}
                >
                    <CheckedIcon/>
                </div>
            </div>
            {showTooltip && !disabled && (
                <Tooltip
                    text = {tooltip}
                    parentRef = {labelRef}
                />
            )}
        </>
    )
}