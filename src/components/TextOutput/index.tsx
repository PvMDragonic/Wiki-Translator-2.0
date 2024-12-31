import React from "react";

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
    return (
        <div className = "textbox">            
            <div contentEditable className = "textbox__textarea">
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