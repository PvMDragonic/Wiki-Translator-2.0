import HelpIcon from "../../assets/HelpIcon";

/**
 * Renders the help button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionHelp(): JSX.Element
{
    return (
        <a 
            href = "https://github.com/PvMDragonic/Wiki-Translator-2.0/blob/main/README.md" 
            target = "_blank"
            style = {{ textDecoration: 'none' }}
        >        
            <button className = "options-bar__button options-bar__button--inactive">
                <HelpIcon/>
                <span>AJUDA</span>
            </button>
    </a>
    )
}