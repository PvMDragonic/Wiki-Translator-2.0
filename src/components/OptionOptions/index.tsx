import OptionsIcon from "../../assets/OptionsIcon";

/**
 * Renders the options button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionOptions(): JSX.Element
{
    return (      
        <button className = "options-bar__button">
            <OptionsIcon/>
            <span>OPÇÕES</span>
        </button>
    )
}