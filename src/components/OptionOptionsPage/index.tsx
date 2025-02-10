import { OptionOptionsEntry } from "@components/OptionOptionsEntry";
import { useSettings } from "@hooks/useSettings";

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
        hyperlinks, setHyperlinks,
        splitData, setSplitData,
        rswData, setRswData,
        untranslated, setUntranslated,
        diffExamine, setDiffExamine,
        aggressive, setAggressive,
        retranslate, setRetranslate,
        debugging, setDebugging,
        debugSplitted, setDebugSplitted,
        debugTemplate, setDebugTemplate,
        debugSuccess, setDebugSuccess,
        debugSkipped, setDebugSkipped,
        debugMissing, setDebugMissing
    } = useSettings();

    const hyperlinkOptions = [
    {
        label: 'Adicionar links',
        lcKey: 'wikiTranslatorHyperlinks',
        tooltip: 'Adiciona hyperlinks às predefinições encontradas no texto traduzido.',
        addendum: undefined,
        state: hyperlinks,
        stateUpdate: setHyperlinks,
        disabled: false
    },
    {
        label: 'Separar predef. Data',
        lcKey: 'wikiTranslatorSplitData',
        tooltip: 'Adiciona links tanto para a página da Predefinição quanto para a data em si em {{Data}}.',
        addendum: undefined,
        state: splitData,
        stateUpdate: setSplitData,
        disabled: !hyperlinks
    },
    {
        label: 'Data RuneScape Wiki',
        lcKey: 'wikiTranslatorRSWData',
        tooltip: 'Clicar em uma {{Data}} também abre a página da Wiki PT-BR correspondente.',
        addendum: 'Precisa que janelas em pop-up estejam permitidas no navegador.',
        state: rswData,
        stateUpdate: setRswData,
        disabled: !hyperlinks
    }];

    const highlightOptions = [
    {
        label: 'Realçar não-traduzido',
        lcKey: 'wikiTranslatorUntranslated',
        tooltip: 'Marca o texto inalterado após a tradução com uma cor diferente.',
        addendum: undefined,
        state: untranslated,
        stateUpdate: setUntranslated,
        disabled: false
    },
    {
        label: 'Diferenciar examinar',
        lcKey: 'wikiTranslatorDiffExamine',
        tooltip: 'Diferencia o examinar não-traduzido das outras partes não-traduzidas.',
        addendum: undefined,
        state: diffExamine,
        stateUpdate: setDiffExamine,
        disabled: !untranslated
    },
    {
        label: 'Marcação agressiva',
        lcKey: 'wikiTranslatorAggressive',
        tooltip: '😡 😡 😡 😡',
        addendum: undefined,
        state: aggressive,
        stateUpdate: setAggressive,
        disabled: !untranslated
    }];

    const devOptions = [
    {
        label: 'Botão retraduzir',
        lcKey: 'wikiTranslatorRetranslate',
        tooltip: 'Adiciona um botão à caixa de entrada de texto para reexecutar a tradução.',
        addendum: undefined,
        state: retranslate,
        stateUpdate: setRetranslate,
        disabled: false
    },
    {
        label: 'Ativar debugger',
        lcKey: 'wikiTranslatorDebugger',
        tooltip: 'Ativa a exibição de todas as variáveis no console do navegador durante a tradução.',
        addendum: undefined,
        state: debugging,
        stateUpdate: setDebugging,
        disabled: false
    },
    {
        label: 'Debugger "splitted"',
        lcKey: 'wikiTranslatorDebugSplitted',
        tooltip: 'Exibe a variável \'splitted\' no debugger durante a tradução.',
        addendum: undefined,
        state: debugSplitted,
        stateUpdate: setDebugSplitted,
        disabled: !debugging
    },
    {
        label: 'Debugger Template',
        lcKey: 'wikiTranslatorDebugTemplate',
        tooltip: 'Exibe as informações no debugger de cada Template encontrado durante a tradução.',
        addendum: undefined,
        state: debugTemplate,
        stateUpdate: setDebugTemplate,
        disabled: !debugging
    },
    {
        label: 'Debugger sucessos',
        lcKey: 'wikiTranslatorDebugSuccess',
        tooltip: 'Exibe no debugger as linhas irregulares de texto traduzidas com sucesso.',
        addendum: undefined,
        state: debugSuccess,
        stateUpdate: setDebugSuccess,
        disabled: !debugging
    },
    {
        label: 'Debugger ignorados',
        lcKey: 'wikiTranslatorDebugSkipped',
        tooltip: 'Exibe no debugger as linhas de texto ignoradas durante a tradução.',
        addendum: undefined,
        state: debugSkipped,
        stateUpdate: setDebugSkipped,
        disabled: !debugging
    },
    {
        label: 'Debugger erros',
        lcKey: 'wikiTranslatorDebugMissing',
        tooltip: 'Exibe no debugger as linhas de texto que são ignoradas por falta e/ou não-existência de dados.',
        addendum: undefined,
        state: debugMissing,
        stateUpdate: setDebugMissing,
        disabled: !debugging
    }];

    return (
        <div className = "side-page">
            <h1 className = "side-page__title">
                Opções
            </h1>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    Hyperlinks
                </h2>
                <ul className = "options-entry__list">
                    {hyperlinkOptions.map((option, index) => (
                        <li key = {index} className = "options-entry__item">
                            <OptionOptionsEntry
                                label = {option.label}
                                lcKey = {option.lcKey}
                                tooltip = {option.tooltip}
                                addendum = {option.addendum}
                                state = {option.state}
                                stateUpdate = {option.stateUpdate}
                                disabled = {option.disabled}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    Texto Não-traduzido
                </h2>
                <ul className = "options-entry__list">
                    {highlightOptions.map((option, index) => (
                        <li key = {index} className = "options-entry__item">
                            <OptionOptionsEntry
                                label = {option.label}
                                lcKey = {option.lcKey}
                                tooltip = {option.tooltip}
                                addendum = {option.addendum}
                                state = {option.state}
                                stateUpdate = {option.stateUpdate}
                                disabled = {option.disabled}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    Desenvolvedor
                </h2>
                <ul className = "options-entry__list">
                    {devOptions.map((option, index) => (
                        <li key = {index} className = "options-entry__item">
                            <OptionOptionsEntry
                                label = {option.label}
                                lcKey = {option.lcKey}
                                tooltip = {option.tooltip}
                                
                                state = {option.state}
                                stateUpdate = {option.stateUpdate}
                                disabled = {option.disabled}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}