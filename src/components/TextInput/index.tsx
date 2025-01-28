import { useContext, useRef } from "react";
import { useHasScrollbar } from "@hooks/useHasScrollbar";
import { IWikiTemplates, IWikiItems } from "./wiki";
import { translate } from "./translation";
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
    
    const { hasScroll } = useHasScrollbar({ elementRef: textRef })
    
    // Having the <textarea>'s 'value' be 'translation.join('\n')' would both the ctrl-Z and ctrl-Y. 
    function handleTextReset()
    {
        setTranslation([]);
        
        if (textRef.current)
            textRef.current.value = '';
    }

    function handleTranslation()
    {
        const params = {
            textToTranslate: textRef.current?.value!,
            templates: templates as IWikiTemplates,
            itemNames: itemNames as IWikiItems,
            debugging,
            debugSplitted,
            debugTemplate,
            debugSuccess,
            debugSkipped, 
            debugMissing
        };

        translate(params).then(
            translation => setTranslation(translation)
        );     
    }

    return (
        <div className = "textbox">
            {textExists && (
                <button 
                    title = "Apagar texto"
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
                    title = "Retraduzir"
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
                lang = "pt"
                ref = {textRef}
                placeholder = "Digite aqui" 
                className = "textbox__textarea" 
                onChange = {handleTranslation}
            />
        </div>
    )
}