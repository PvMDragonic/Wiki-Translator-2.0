import { OptionOptions } from "@components/OptionOptions";
import { OptionHelp } from "@components/OptionHelp";

/**
 * Renders the container for the options atop the translator.
 *
 * @component
 * @returns {JSX.Element} The rendered OptionsBar component.
 */
export function OptionsBar(): JSX.Element
{
    return (
        <div className = "options-bar">
            <div className = "options-bar__container">
                <OptionOptions/>
                <OptionHelp/>
            </div>
            <div className = "options-bar__container">
                <h1>Wiki Translator</h1>
            </div>
        </div>
    )
}