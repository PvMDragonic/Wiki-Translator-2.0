import { OptionOptionsButton } from "@components/OptionOptionsButton";
import { OptionOptionsEntry } from "@components/OptionOptionsEntry";
import { useTranslation } from "react-i18next";
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
        removeBody, setRemoveBody,
        equalsSpacing, setEqualsSpacing,
        untranslated, setUntranslated,
        diffExamine, setDiffExamine,
        diffNavboxes, setDiffNavboxes,
        diffCategories, setDiffCategories,
        aggressive, setAggressive,
        retranslate, setRetranslate,
        debugging, setDebugging,
        debugSplitted, setDebugSplitted,
        debugTemplate, setDebugTemplate,
        debugSuccess, setDebugSuccess,
        debugSkipped, setDebugSkipped,
        debugMissing, setDebugMissing
    } = useSettings();

    const { t, i18n } = useTranslation();

    const hyperlinkOptions = [
    {
        label: t('Add links'),
        lcKey: 'wikiTranslatorHyperlinks',
        tooltip: t('Add links description'),
        addendum: undefined,
        state: hyperlinks,
        stateUpdate: setHyperlinks,
        disabled: false
    },
    {
        label: t('Split data template'),
        lcKey: 'wikiTranslatorSplitData',
        tooltip: t('Split data template description'),
        addendum: undefined,
        state: splitData,
        stateUpdate: setSplitData,
        disabled: !hyperlinks
    },
    {
        label: t('Date rsw'),
        lcKey: 'wikiTranslatorRSWData',
        tooltip: t('Date rsw description'),
        addendum: t('Date rsw addendum'),
        state: rswData,
        stateUpdate: setRswData,
        disabled: !hyperlinks
    }];

    const textFormatting = [
    {
        label: t('Remove text'),
        lcKey: 'wikiTranslatorRemoveBody',
        tooltip: t('Remove text description'),
        addendum: t('Remove text addendum'),
        state: removeBody,
        stateUpdate: setRemoveBody,
        disabled: false
    },
    {
        label: t('Space equals sign'),
        lcKey: 'wikiTranslatorEqualsSpacing',
        tooltip: t('Space equals sign description'),
        addendum: t('Space equals sign addendum'),
        state: equalsSpacing,
        stateUpdate: setEqualsSpacing,
        disabled: false
    },
    {
        label: t('Highlight untranslated'),
        lcKey: 'wikiTranslatorUntranslated',
        tooltip: t('Highlight untranslated description'),
        addendum: undefined,
        state: untranslated,
        stateUpdate: setUntranslated,
        disabled: false
    },
    {
        label: t('Differentiate examines'),
        lcKey: 'wikiTranslatorDiffExamine',
        tooltip: t('Differentiate examines description'),
        addendum: undefined,
        state: diffExamine,
        stateUpdate: setDiffExamine,
        disabled: !untranslated
    },
    {
        label: t('Differentiate navboxes'),
        lcKey: 'wikiTranslatorDiffNavboxes',
        tooltip: t('Differentiate navboxes description'),
        addendum: undefined,
        state: diffNavboxes,
        stateUpdate: setDiffNavboxes,
        disabled: !untranslated
    },
    {
        label: t('Differentiate categories'),
        lcKey: 'wikiTranslatorDiffCategories',
        tooltip: t('Differentiate categories description'),
        addendum: undefined,
        state: diffCategories,
        stateUpdate: setDiffCategories,
        disabled: !untranslated
    },
    {
        label: t('Aggressive highlighting'),
        lcKey: 'wikiTranslatorAggressive',
        tooltip: '😡 😡 😡 😡',
        addendum: undefined,
        state: aggressive,
        stateUpdate: setAggressive,
        disabled: !untranslated
    }];

    const devOptions = [
    {
        label: t('Retranslate'),
        lcKey: 'wikiTranslatorRetranslate',
        tooltip: t('Retranslate description'),
        addendum: undefined,
        state: retranslate,
        stateUpdate: setRetranslate,
        disabled: false
    },
    {
        label: t('Debugger'),
        lcKey: 'wikiTranslatorDebugger',
        tooltip: t('Debugger description'),
        addendum: undefined,
        state: debugging,
        stateUpdate: setDebugging,
        disabled: false
    },
    {
        label: 'Debugger "splitted"',
        lcKey: 'wikiTranslatorDebugSplitted',
        tooltip: t('Debugger splitted'),
        addendum: undefined,
        state: debugSplitted,
        stateUpdate: setDebugSplitted,
        disabled: !debugging
    },
    {
        label: 'Debugger Template',
        lcKey: 'wikiTranslatorDebugTemplate',
        tooltip: t('Debugger template'),
        addendum: undefined,
        state: debugTemplate,
        stateUpdate: setDebugTemplate,
        disabled: !debugging
    },
    {
        label: t('Debugger success'),
        lcKey: 'wikiTranslatorDebugSuccess',
        tooltip: t('Debugger success description'),
        addendum: undefined,
        state: debugSuccess,
        stateUpdate: setDebugSuccess,
        disabled: !debugging
    },
    {
        label: t('Debugger skipped'),
        lcKey: 'wikiTranslatorDebugSkipped',
        tooltip: t('Debugger skipped description'),
        addendum: undefined,
        state: debugSkipped,
        stateUpdate: setDebugSkipped,
        disabled: !debugging
    },
    {
        label: t('Debugger errors'),
        lcKey: 'wikiTranslatorDebugMissing',
        tooltip: t('Debugger errors description'),
        addendum: undefined,
        state: debugMissing,
        stateUpdate: setDebugMissing,
        disabled: !debugging
    }];

    return (
        <div className = "side-page">
            <h1 className = "side-page__title">
                {t('Options')}
            </h1>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    {t('Language')}
                </h2>
                <ul className = "options-entry__list options-entry__list--buttons">
                    <li>
                        <OptionOptionsButton
                            label = {'PT'}
                            tooltip = {'Português-Brasileiro'}
                            active = {i18n.language === 'pt' || i18n.language.startsWith('pt-')}
                            onClick = {() => i18n.changeLanguage('pt')}
                        />
                    </li>
                    <li>
                        <OptionOptionsButton
                            label = {'EN'}
                            tooltip = {'English'}
                            active = {i18n.language === 'en' || i18n.language.startsWith('en-')}
                            onClick = {() => i18n.changeLanguage('en')}
                        />
                    </li>
                </ul>
            </div>
            <div className = "options-entry">
                <h2 className = "options-entry__title">
                    {t('Hyperlinks')}
                </h2>
                <ul className = "options-entry__list options-entry__list--text">
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
                    {t('Text formatting')}
                </h2>
                <ul className = "options-entry__list options-entry__list--text">
                    {textFormatting.map((option, index) => (
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
                    {t('Developer')}
                </h2>
                <ul className = "options-entry__list options-entry__list--text">
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