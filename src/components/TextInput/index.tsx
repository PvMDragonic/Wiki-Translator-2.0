import { translate } from "./translation";
import NegativeIcon from "../../assets/NegativeIcon";

interface ITextInput
{
    translation: string[];
    setTranslation: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Renders the text input's textarea.
 *
 * @component
 * @param {ITextInput} props - The properties object for the component.
 * @param {string[]} props.translation - The state string array.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setTranslation - A function to update the translation state.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export function TextInput({ translation, setTranslation }: ITextInput): JSX.Element
{
    function handleTranslation(event: React.ChangeEvent<HTMLTextAreaElement>)
    {
        translate(event.target.value).then(
            translation => setTranslation(translation)
        );     
    }

    const actualTextExists = !(translation[0] === '' && translation.length === 1);

    return (
        <div className = "textbox">
            {actualTextExists && (
                <button 
                    className = "textbox__button"
                    onClick = {() => setTranslation([''])}
                >
                    <NegativeIcon/>
                </button>
            )}

            <textarea
                lang = "pt"
                placeholder = "Digite aqui" 
                className = "textbox__textarea" 
                onChange = {handleTranslation}
                value = {translation.join('\n')}
            />
        </div>
    )
}