import { useContext, useEffect } from "react";
import { OptionOptionsEntry } from "../OptionOptionsEntry";
import SettingsContext from "../../pages/Home/settingsContext";

/**
 * Renders the side menu content for the options button.
 *
 * @component
 * @returns {JSX.Element} The rendered page.
 */
export function OptionOptionsPage(): JSX.Element
{
    const { 
        retranslate, setRetranslate,
        debugging, setDebugging 
    } = useContext(SettingsContext);

    useEffect(() => 
    {
        const _retranslate = localStorage.getItem('wikiTranslatorRetranslate');
        if (_retranslate !== null) 
            setRetranslate(JSON.parse(_retranslate));

        const _debugging = localStorage.getItem('wikiTranslatorDebugger');
        if (_debugging !== null) 
            setDebugging(JSON.parse(_debugging));
    }, []);

    return (
        <div className = "side-page">
            <h1 className = "side-page__title">
                Opções
            </h1>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    Desenvolvedor
                </h2>
                <ul className = "options-entry__list">
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Botão retraduzir'}
                            lcKey = {'wikiTranslatorRetranslate'}
                            tooltip = {'Adiciona um botão à caixa de entrada de texto para reexecutar a tradução.'}
                            state = {retranslate}
                            stateUpdate = {setRetranslate}
                        />
                    </li>
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Ativar debugger'}
                            lcKey = {'wikiTranslatorDebugger'}
                            tooltip = {'Ativa a exibição de todas as variáveis no console do navegador durante a tradução.'}
                            state = {debugging}
                            stateUpdate = {setDebugging}
                        />
                    </li>
                </ul>
            </div>
            
        </div>
    )
}