import { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHasScrollbar } from "@hooks/useHasScrollbar";
import { IWikiTemplates, IWikiItems } from "../../api/wiki";
import { Translation } from "./translation";
import SettingsContext from "@pages/Home/settingsContext";
import TranslateIcon from "@assets/TranslateIcon";
import NegativeIcon from "@assets/NegativeIcon";

interface ITextInput
{
    textExists: boolean;
    templates: IWikiTemplates;
    itemNames: IWikiItems;
    setTranslation: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Renders the text input's textarea.
 *
 * @component
 * @param {ITextInput} props - The properties object for the component.
 * @param {boolean} props.textExists - Whether or not the textarea has actual text.
 * @param {IWikiTemplates} props.templates - An object containing the wiki templates data.
 * @param {IWikiItems} props.itemNames - An object containing item naming data from the wiki.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setTranslation - A function to update the translation state.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export function TextInput({ textExists, templates, itemNames, setTranslation }: ITextInput): JSX.Element
{
    const textRef = useRef<HTMLTextAreaElement>(null);

    const { 
        retranslate, 
        debugging,
        debugSplitted,
        debugTemplate, 
        debugSuccess,
        debugSkipped, 
        debugMissing
    } = useContext(SettingsContext);
    
    const { hasScroll } = useHasScrollbar({ elementRef: textRef });

    const { t, i18n } = useTranslation();
    
    // Having the <textarea>'s 'value' be 'translation.join('\n')' would both the ctrl-Z and ctrl-Y. 
    function handleTextReset()
    {
        setTranslation([]);
        
        if (textRef.current)
            textRef.current.value = '';
    }

    function handleTranslation()
    {
        const debugFlags = {
            debugging,
            debugSplitted,
            debugTemplate,
            debugSuccess,
            debugSkipped, 
            debugMissing
        }

        const translation = new Translation(
            templates,
            itemNames,
            debugFlags
        )

        translation.translate(textRef.current?.value!).then(
            translated => setTranslation(translated)
        );     
    }

    return (
        <div className = "textbox">
            {textExists && (
                <button 
                    title = {t('Clear text')}
                    className = "textbox__button textbox__button--clear-input"
                    onClick = {handleTextReset}
                    style = {{
                        left: hasScroll ? 'calc(100% - 4rem)' : 'calc(100% - 3.125rem)'
                    }}
                >
                    <NegativeIcon/>
                </button>
            )}
            {textExists && retranslate && (
                <button 
                    title = {t('Retranslate button')}
                    className = "textbox__button textbox__button--retranslate"
                    onClick = {handleTranslation}
                    style = {{
                        left: hasScroll ? 'calc(100% - 4rem)' : 'calc(100% - 3.125rem)'
                    }}
                >
                    <TranslateIcon/>
                </button>
            )}
            <textarea
                ref = {textRef}
                lang = {i18n.language}
                placeholder = {t('Type here')} 
                className = "textbox__textarea" 
                onChange = {handleTranslation}
            />
        </div>
    )
}