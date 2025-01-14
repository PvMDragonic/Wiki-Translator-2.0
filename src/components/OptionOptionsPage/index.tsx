import { useState } from "react";
import { OptionOptionsEntry } from "../OptionOptionsEntry";

/**
 * Renders the side menu content for the options button.
 *
 * @component
 * @returns {JSX.Element} The rendered page.
 */
export function OptionOptionsPage(): JSX.Element
{
    const [temp, setTemp] = useState<boolean>(false);

    return (
        <div className = "side-page">
            <h1 className = "side-page__title">
                Opções
            </h1>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    Texto Traduzido
                </h2>
                <ul className = "options-entry__list">
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Teste testificado'}
                            tooltip = {''}
                            state = {temp}
                            stateUpdate = {setTemp}
                        />
                    </li>
                </ul>
            </div>
            
        </div>
    )
}