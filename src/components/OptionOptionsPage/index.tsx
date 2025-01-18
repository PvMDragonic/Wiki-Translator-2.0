import { OptionOptionsEntry } from "../OptionOptionsEntry";
import { useDebugger } from "../../hooks/useDebugger";

/**
 * Renders the side menu content for the options button.
 *
 * @component
 * @returns {JSX.Element} The rendered page.
 */
export function OptionOptionsPage(): JSX.Element
{
    const 
    {
        retranslate,
        setRetranslate,
        debugging,
        setDebugging,
        debugSplitted,
        setDebugSplitted,
        debugTemplate,
        setDebugTemplate,
        debugSuccess,
        setDebugSuccess,
        debugSkipped,
        setDebugSkipped,
        debugMissing,
        setDebugMissing,
    } = useDebugger();

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