import { OptionGE } from "@components/OptionGE";
import { OptionHelp } from "@components/OptionHelp";
import { OptionOptions } from "@components/OptionOptions";
import { OptionHU } from "@components/OptionsUH";

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
                <OptionHU/>
                <OptionGE/>
                <OptionOptions/>
                <OptionHelp/>
            </div>
            <div className = "options-bar__container">
                <h1>Wiki Translator</h1>
            </div>
        </div>
    )
}