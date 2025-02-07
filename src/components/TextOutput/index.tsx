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
    const { hyperlinks, splitData, untranslated, diffExamine, aggressive } = useContext(SettingsContext);

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
        // {{Data}} formatting inside {{UL}}.
        if (line.startsWith('*') && !line.startsWith('**'))
        {
            const [firstPart, dataPlusRest] = line.split('data=');
            const [day, month, year] = dataPlusRest.split(' ');
            const cleanYear = year.slice(0, 4);
            const restFromYear = year.slice(4);

            const monthNumber = new Intl.DateTimeFormat(
                'en-US', { month: 'numeric' }
            ).format(
                new Date(`${month} 1, 2000`)
            );

            const months: Record<string, string> = {
                'january': 'Janeiro',
                'february': 'Fevereiro',
                'march': 'Março',
                'april': 'Abril',
                'may': 'Maio',
                'june': 'Junho',
                'july': 'Julho',
                'august': 'Agosto',
                'september': 'Setembro',
                'october': 'Outubro',
                'november': 'Novembro',
                'december': 'Dezembro'
            }

            const formattedDate = `${!splitData || !hyperlinks ? 'Data' : ''}|${day}|${months[month.toLowerCase()]}|${cleanYear}`;

            return (
                <span>
                    {firstPart}
                    {'data={{'}
                    {splitData && hyperlinks && (
                        <a 
                            target = '_blank'
                            href = {'https://pt.runescape.wiki/w/Predefinição:Data'} 
                            style = {{ color: '#ff7700' }}
                        >
                            Data
                        </a>
                    )}
                    {hyperlinks ? (
                        <a 
                            href = {`https://secure.runescape.com/m=news/l=3/a=9/archive?year=${cleanYear}&month=${monthNumber}&filter=Filtrar`} 
                            target = '_blank'
                        >
                            {formattedDate}
                        </a>
                    ) : (
                        formattedDate
                    )}
                    {'}}'}
                    {`${restFromYear}`}
                </span>
            )
        }

        // {{Data}} formatting.
        if (line.startsWith('%'))
        {
            const lineWithoutPrefix = line.slice(1);
            const [paramName, day, month, year] = lineWithoutPrefix.split(' = ');
            const monthNumber = new Intl.DateTimeFormat('pt-BR', { month: 'numeric' }).format(new Date(`${month} 1, 2000`));
            const formattedDate = `${!splitData || !hyperlinks ? 'Data' : ''}|${day}|${month}|${year}`;

            return (
                <span>
                    {paramName}
                    {' = {{'}
                    {splitData && hyperlinks && (
                        <a 
                            target = '_blank'
                            href = {'https://pt.runescape.wiki/w/Predefinição:Data'} 
                            style = {{ color: '#ff7700' }}
                        >
                            Data
                        </a>
                    )}
                    {hyperlinks ? (
                        <a 
                            href = {`https://secure.runescape.com/m=news/l=3/a=9/archive?year=${year}&month=${monthNumber}&filter=Filtrar`} 
                            target = '_blank'
                        >
                            {formattedDate}
                        </a>
                    ) : (
                        formattedDate
                    )}
                    {'}}'}
                </span>
            )
        }

        // Examine coloring inside {{Infobox Item}}.
        if (line.startsWith('$'))
        {
            const lineWithoutPrefix = line.slice(1);

            if (!untranslated)
                return lineWithoutPrefix;

            const [examineParam, examineText] = lineWithoutPrefix.split(' = ');

            return (
                <span>
                    {`${examineParam} = `}
                    <span 
                        style = {{ 
                            ...(aggressive && { background: '#ca4c4c' }),
                            color: diffExamine ? '#ffce00' : !aggressive ? '#ff5a5a' : undefined,
                            fontWeight: 'bold' 
                        }}
                    >
                        {examineText}
                    </span>
                </span>
            );
        }

        // Article body.
        if (line.startsWith('¬')) 
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
                    style = {untranslated ? style : undefined}
                >
                    {line.slice(1)}
                </span>
            );
        }

        // Untranslated param and/or value in any Template.
        const [paramName, paramValue] = line.split(' = ');
        if (line.startsWith('|&') || line.startsWith('&') || (paramValue && paramValue.startsWith('&')))
        {
            const condition = 
                paramName.startsWith('|&') || 
                paramName.startsWith('&') && 
                !paramName.startsWith('&{');

            const firstHalf = condition
                ? paramName.slice(2)
                : paramName.slice(1);

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

            if (!paramValue) 
            {
                if (!untranslated) 
                    return !firstHalf.startsWith('{') ? `|${firstHalf}` : firstHalf;

                return (
                    <span>
                        {firstHalf.startsWith('{') ? '' : '|'}
                        {`|${firstHalf}` !== paramName ? renderSpan(firstHalf) : firstHalf}
                    </span>
                );
            }

            const secondHalf = paramValue.startsWith('&') 
                ? paramValue.slice(1) 
                : paramValue;

            if (!untranslated) 
                return `|${firstHalf} = ${secondHalf}`;
            
            return (
                <span>
                    {firstHalf.startsWith('{') ? '' : '|'}
                    {`|${firstHalf}` !== paramName ? renderSpan(firstHalf) : firstHalf}
                    {' = '}
                    {secondHalf !== paramValue ? renderSpan(secondHalf) : secondHalf}
                </span>
            );
        }

        // Template name hyperlink.
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