import GrandExchangeIcon from "../../assets/GrandExchangeIcon";

/**
 * Renders the Grand Exchange button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionGE(): JSX.Element
{
    return (      
        <button className = "options-bar__button">
            <GrandExchangeIcon/>
            <span>M.G.</span>
        </button>
    )
}