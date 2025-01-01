import React, { useEffect, useState } from "react";
import CopyIcon from "../../assets/CopyIcon";

interface ITextOutput
{
    translation: string[];
}

/**
 * Renders the text output's div contentEditable.
 *
 * @component
 * @param {ITextOutput} props - The properties object for the component.
 * @param {string[]} props.translation - The updated translation string array, coming from TextInput.
 * @returns {JSX.Element} The rendered TextOutput component.
 */
export function TextOutput({ translation }: ITextOutput): JSX.Element
{
    const [textExists, setTextExists] = useState<Boolean>(false);
    const [showCopy, setShowCopy] = useState<Boolean>(false);

    useEffect(() => 
    {
        const actualTextExists = !(translation[0] === '' && translation.length === 1);
        setTextExists(actualTextExists);
        setShowCopy(actualTextExists);
    }, [translation]);

    function handleClipboard()
    {
        navigator.clipboard
            .writeText(translation.join('\n'))
            .then(() => 
            {
                setShowCopy(false);
                setTimeout(() => setShowCopy(true), 2500);
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    }

    return (
        <div className = "textbox">            
            <div contentEditable className = "textbox__textarea">
                {textExists && showCopy && (
                    <button 
                        className = "textbox__button"
                        onClick = {handleClipboard}
                    >
                        <CopyIcon/>
                    </button>
                )}

                {translation.map((line, index) => (
                    <React.Fragment key = {index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}