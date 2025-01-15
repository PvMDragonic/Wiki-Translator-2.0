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
        debugging, setDebugging,
        debugSplitted, setDebugSplitted,
        debugTemplate, setDebugTemplate,
        debugSuccess, setDebugSuccess,
        debugSkipped, setDebugSkipped,
        debugMissing, setDebugMissing 
    } = useContext(SettingsContext);

    useEffect(() => 
    {
        const _retranslate = localStorage.getItem('wikiTranslatorRetranslate');
        if (_retranslate !== null) 
            setRetranslate(JSON.parse(_retranslate));

        const _debugging = localStorage.getItem('wikiTranslatorDebugger');
        if (_debugging !== null) 
            setDebugging(JSON.parse(_debugging));

        const _debugSplitted = localStorage.getItem('wikiTranslatorDebugSplitted');
        if (_debugSplitted !== null) 
            setDebugSplitted(JSON.parse(_debugSplitted));

        const _debugTemplate = localStorage.getItem('wikiTranslatorDebugTemplate');
        if (_debugTemplate !== null) 
            setDebugTemplate(JSON.parse(_debugTemplate));

        const _debugSuccess = localStorage.getItem('wikiTranslatorDebugSuccess');
        if (_debugSuccess !== null) 
            setDebugSuccess(JSON.parse(_debugSuccess));

        const _debugSkipped = localStorage.getItem('wikiTranslatorDebugSkipped');
        if (_debugSkipped !== null) 
            setDebugSkipped(JSON.parse(_debugSkipped));

        const _debugMissing = localStorage.getItem('wikiTranslatorDebugMissing');
        if (_debugMissing !== null) 
            setDebugMissing(JSON.parse(_debugMissing));
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
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Debugger "splitted"'}
                            lcKey = {'wikiTranslatorDebugSplitted'}
                            tooltip = {'Exibe a variável \'splitted\' no debugger durante a tradução.'}
                            disabled = {!debugging}
                            state = {debugSplitted}
                            stateUpdate = {setDebugSplitted}
                        />
                    </li>
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Debugger Template'}
                            lcKey = {'wikiTranslatorDebugTemplate'}
                            tooltip = {'Exibe as informações no debugger de cada Template encontrado durante a tradução.'}
                            disabled = {!debugging}
                            state = {debugTemplate}
                            stateUpdate = {setDebugTemplate}
                        />
                    </li>
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Debugger sucessos'}
                            lcKey = {'wikiTranslatorDebugSuccess'}
                            tooltip = {'Exibe no debugger as linhas irregulares de texto traduzidas com sucesso.'}
                            disabled = {!debugging}
                            state = {debugSuccess}
                            stateUpdate = {setDebugSuccess}
                        />
                    </li>
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Debugger ignorados'}
                            lcKey = {'wikiTranslatorDebugSkipped'}
                            tooltip = {'Exibe no debugger as linhas de texto ignoradas durante a tradução.'}
                            disabled = {!debugging}
                            state = {debugSkipped}
                            stateUpdate = {setDebugSkipped}
                        />
                    </li>
                    <li className = "options-entry__item">
                        <OptionOptionsEntry
                            label = {'Debugger erros'}
                            lcKey = {'wikiTranslatorDebugMissing'}
                            tooltip = {'Exibe no debugger as linhas de texto que são ignoradas por falta e/ou não-existência de dados.'}
                            disabled = {!debugging}
                            state = {debugMissing}
                            stateUpdate = {setDebugMissing}
                        />
                    </li>
                </ul>
            </div>
            
        </div>
    )
}