import { useRef } from "react";
import { translate } from "./translation";
import { useHasScrollbar } from "../../hooks/useHasScrollbar";
import NegativeIcon from "../../assets/NegativeIcon";

interface ITextInput
{
    textExists: boolean;
    setTranslation: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Renders the text input's textarea.
 *
 * @component
 * @param {ITextInput} props - The properties object for the component.
 * @param {boolean} props.textExists - Whether or not the textarea has actual text.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setTranslation - A function to update the translation state.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export function TextInput({ textExists, setTranslation }: ITextInput): JSX.Element
{
    const textRef = useRef<HTMLTextAreaElement>(null);
    
    const { hasScroll } = useHasScrollbar({ elementRef: textRef })
    
    // Having the <textarea>'s 'value' be 'translation.join('\n')' would both the ctrl-Z and ctrl-Y. 
    function handleTextReset()
    {
        setTranslation(['']);
        
        if (textRef.current)
            textRef.current.value = '';
    }

    function handleTranslation(event: React.ChangeEvent<HTMLTextAreaElement>)
    {
        translate(event.target.value).then(
            translation => setTranslation(translation)
        );     
    }

    return (
        <div className = "textbox">
            {textExists && (
                <button 
                    className = "textbox__button"
                    onClick = {handleTextReset}
                    style = {{
                        left: hasScroll ? 'calc(100% - 4rem)' : 'calc(100% - 3.125rem)'
                    }}
                >
                    <NegativeIcon/>
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