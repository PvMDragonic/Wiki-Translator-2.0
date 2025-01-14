import CheckedIcon from "../../assets/CheckedIcon";

interface IOptionOptionsEntry
{
    label: string;
    tooltip: string;
    state: boolean;
    stateUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Renders a settings entry for the options page.
 *
 * @component
 * @param {IOptionOptionsEntry} props - The properties object for the component.
 * @param {string} props.label - Text for the setting's label.
 * @param {string} props.tooltip - Text for the setting's tooltip.
 * @param {boolean} props.state - Whether or not the setting is active.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.stateUpdate - A function to update the setting state.
 * @returns {JSX.Element} The rendered label and input.
 */
export function OptionOptionsEntry({ label, tooltip, state, stateUpdate }: IOptionOptionsEntry): JSX.Element
{
    return (
        <>
            <div className = "options-entry__label-container">
                <label 
                    htmlFor = {label}
                    className = "options-entry__label"
                >
                    {label}{tooltip}
                </label>
            </div>
            <div className = "options-entry__input-container">
                <input
                    id = {label}
                    type = "checkbox" 
                    className = "options-entry__accessibility-input"
                    onChange = {() => stateUpdate(prev => !prev)}
                />                
                <div
                    className = "options-entry__actual-input"
                    onClick = {() => stateUpdate(prev => !prev)}
                >
                    {state && <CheckedIcon/>}
                </div>
            </div>
        </>
    )
}