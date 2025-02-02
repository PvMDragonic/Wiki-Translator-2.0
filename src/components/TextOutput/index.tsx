import React, { useContext, useEffect, useRef, useState } from "react";
import { useHasScrollbar } from "@hooks/useHasScrollbar";
import SettingsContext from "@pages/Home/settingsContext";
import CheckedIcon from "@assets/CheckedIcon";
import CopyIcon from "@assets/CopyIcon";

interface ITextOutput
{
    textExists: boolean;
    translation: string[];
}

/**
 * Renders the text output's div contentEditable.
 *
 * @component
 * @param {ITextOutput} props - The properties object for the component.
 * @param {boolean} props.textExists - Whether or not the text div has actual text.
 * @param {string[]} props.translation - The updated translation string array, coming from TextInput.
 * @returns {JSX.Element} The rendered TextOutput component.
 */
export function TextOutput({ textExists, translation }: ITextOutput): JSX.Element
{
    const textRef = useRef<HTMLDivElement>(null);

    const [showCopy, setShowCopy] = useState<boolean>(false);

    const { hasScroll } = useHasScrollbar({ elementRef: textRef });
    const { hyperlinks, untranslated, diffExamine, aggressive } = useContext(SettingsContext);

    useEffect(() => setShowCopy(textExists), [textExists]);

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

    function formatLine(line: string)
    {
        if (line.startsWith('$'))
        {
            const lineWithoutPrefix = line.slice(1);

            if (!untranslated)
                return lineWithoutPrefix;

            const splittedLine = lineWithoutPrefix.split(' = ');

            return (
                <span>
                    {`${splittedLine[0]} = `}
                    <span 
                        style = {{ 
                            ...(aggressive && { background: '#ca4c4c' }),
                            color: diffExamine ? '#ffce00' : !aggressive ? '#ff5a5a' : undefined,
                            fontWeight: 'bold' 
                        }}
                    >
                        {splittedLine[1]}
                    </span>
                </span>
            );
        }

        if (line.startsWith('¬')) 
        {
            return line.slice(1).split('\n').map(thisLine => 
            {
                const style = {
                    fontWeight: 'bold', 
                    ...(aggressive 
                        ? { background: '#ca4c4c' } 
                        : { color: '#ff5a5a' }
                    )
                };
        
                return (
                    <span 
                        key = {thisLine} 
                        style = {untranslated ? style : undefined}
                    >
                        {thisLine}
                        <br />
                    </span>
                );
            });
        }

        const lineSplit = line.split(' = ');
        if (line.startsWith('|&') || line.startsWith('&') || (lineSplit.length > 1 && lineSplit[1].startsWith('&')))
        {
            const condition = 
                lineSplit[0].startsWith('|&') || 
                lineSplit[0].startsWith('&') && 
                !lineSplit[0].startsWith('&{');

            const firstHalf = condition
                ? lineSplit[0].slice(2)
                : lineSplit[0].slice(1);

            function renderSpan(text: string) 
            { 
                return (
                    <span style = {{
                        ...(aggressive ? { background: '#ca4c4c' } : { color: '#ff5a5a' }),
                        fontWeight: 'bold'
                    }}>
                        {text}
                    </span>
                );
            }

            if (lineSplit.length === 1) 
            {
                if (!untranslated) 
                    return !firstHalf.startsWith('{') ? `|${firstHalf}` : firstHalf;

                return (
                    <span>
                        {firstHalf.startsWith('{') ? '' : '|'}
                        {`|${firstHalf}` !== lineSplit[0] ? renderSpan(firstHalf) : firstHalf}
                    </span>
                );
            }

            // Missing Template in the wiki json.
            if (lineSplit.length > 2)
            {
                const newFirstHalf = firstHalf.split('\n');
                const secondHalf = lineSplit.slice(1).join(' = ').split('\n');

                return (
                    <span>
                        {!untranslated ? newFirstHalf[0] : renderSpan(newFirstHalf[0])}
                        <br/>
                        {!untranslated ? newFirstHalf[1] : renderSpan(newFirstHalf[1])}
                        {' = '}
                        {secondHalf.map(thisLine => 
                        {
                            const thisLineSplit = thisLine.split(' = ');
                            return (
                                <span key = {thisLine}>
                                    {!untranslated ? thisLineSplit[0] : renderSpan(thisLineSplit[0])}
                                    {thisLineSplit.length === 2 && (' = ')}
                                    {thisLineSplit.length === 2 && (!untranslated ? thisLineSplit[1] : renderSpan(thisLineSplit[1]))}
                                    <br/>
                                </span>
                            )
                        })}
                    </span>
                )
            }

            const secondHalf = lineSplit[1].startsWith('&') 
                ? lineSplit[1].slice(1) 
                : lineSplit[1];

            if (!untranslated) 
                return `|${firstHalf} = ${secondHalf}`;
            
            return (
                <span>
                    {firstHalf.startsWith('{') ? '' : '|'}
                    {`|${firstHalf}` !== lineSplit[0] ? renderSpan(firstHalf) : firstHalf}
                    {' = '}
                    {secondHalf !== lineSplit[1] ? renderSpan(secondHalf) : secondHalf}
                </span>
            );
        }

        if (line.startsWith('§'))
        {
            const lineWithoutPrefix = line.slice(1);

            if (!hyperlinks)
                return lineWithoutPrefix;

            const splittedLine = lineWithoutPrefix.split('|');
            const formattedLine = splittedLine[0].slice(2);

            return (
                <span>
                    {'{{'}
                    <a 
                        href = {`https://pt.runescape.wiki/w/Predefinição:${formattedLine}`} 
                        target = '_blank'
                    >
                        {formattedLine}
                    </a>
                    {splittedLine.length > 1 && splittedLine[1]}
                </span>
            );   
        }

        return line;
    }

    return (
        <div className = "textbox">            
            <div 
                className = "textbox__textarea"
                onClick = {() => textRef.current?.focus()}
                tabIndex = {0}
                ref = {textRef}
            >
                {textExists && (
                    showCopy ? (
                        <button 
                            title = "Copiar texto"
                            className = "textbox__button"
                            onClick = {handleClipboard}
                            style = {{
                                left: hasScroll ? 'calc(100% - 4rem)' : 'calc(100% - 3.125rem)'
                            }}
                        >
                            <CopyIcon/>
                        </button>
                    ) : (
                        <button 
                            title = "Texto copiado com sucesso"
                            className = "textbox__button"
                            style = {{
                                left: hasScroll ? 'calc(100% - 4rem)' : 'calc(100% - 3.125rem)',
                                padding: '0.25rem'
                            }}
                        >
                            <CheckedIcon/>
                        </button>
                    )
                )}
                {translation.map((line, index) => (
                    <React.Fragment key = {index}>
                        {formatLine(line)}
                        <br/>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}