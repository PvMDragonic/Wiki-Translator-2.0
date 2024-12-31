import { translate } from "./translation";

interface ITextInput
{
    setTranslation: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Renders the text input's textarea.
 *
 * @component
 * @param {ITextInput} props - The properties object for the component.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setTranslation - A function to update the translation state.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export function TextInput({ setTranslation }: ITextInput): JSX.Element
{
    function handleTranslation(event: React.ChangeEvent<HTMLTextAreaElement>)
    {
        translate(event.target.value).then(
            translation => setTranslation(translation)
        );     
    }

    return (
        <div className = "textbox">
            <textarea
                lang = "pt"
                placeholder = "Digite aqui" 
                className = "textbox__textarea" 
                onChange = {handleTranslation}
            />
        </div>
    )
}