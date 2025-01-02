import UpdateHistoryIcon from "../../assets/UpdateHistoryIcon";

/**
 * Renders the update history button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionHU(): JSX.Element
{
    return (      
        <button className = "options-bar__button">
            <UpdateHistoryIcon/>
            <span>H.A.</span>
        </button>
    )
}