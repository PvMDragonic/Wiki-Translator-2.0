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
    const { 
        hyperlinks, splitData, rswData, 
        removeBody, untranslated, diffExamine, 
        diffNavboxes, diffCategories, aggressive 
    } = useContext(SettingsContext);

    useEffect(() => setShowCopy(textExists), [textExists]);

    function handleClipboard()
    {
        const charsToRemove = ['&', '§', '$', '¬', '¬¬', '%'];
  
        // Needs to remove the markings used to highlight untranslated text.
        const cleanStrings = translation.map(str => 
        {
            let modifiedStr = str;
            
            while (charsToRemove.some(char => modifiedStr.startsWith(char))) 
            {
                const match = charsToRemove.find(char => modifiedStr.startsWith(char));
                modifiedStr = match ? modifiedStr.slice(match.length) : modifiedStr;
            }
            
            // Very unoptimized, but this whole 
            // function isn't called ofter so w/e.
            modifiedStr = modifiedStr
                .replace('=&', '=')
                .replace(' = &', ' = ');

            return modifiedStr;
        });

        navigator.clipboard
            .writeText(cleanStrings.join('\n'))
            .then(() => 
            {
                setShowCopy(false);
                setTimeout(() => setShowCopy(true), 2500);
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    }

    function renderUntranslatedSpan(text: string) 
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

    function formatLine(line: string)
    {
        // Update description about {{UL}}.
        if (line.startsWith('**'))
        {
            // A little bit more optimized than adding another entry
            // to the 'replacements' dictionary in 'translation()'.
            if (line === '** Added to game.')
                return (
                    <span>
                        ** Adicionado ao jogo.
                    </span>
                )

            const cleanLine = line.slice(3);

            return (
                <span>
                    ** {untranslated ? renderUntranslatedSpan(cleanLine) : cleanLine}
                </span>
            )
        }

        // {{Data}} formatting inside {{UL}}.
        if (line.startsWith('*') && !line.startsWith('**'))
        {
            const [firstPart, dataPlusRest] = line.split('data=');
            const [day, month, year] = dataPlusRest.split(' ');
            const cleanYear = year.slice(0, 4);
            const restFromYear = year.slice(4);

            function formattedFirstPart()
            {
                const [beginning, updateText] = firstPart.split('=&');
                const [cleanUpdText, restPastUpdate] = updateText.split('|');
                
                return (
                    <span>
                        {beginning}
                        =
                        {untranslated ? renderUntranslatedSpan(cleanUpdText) : cleanUpdText}
                        |
                        {restPastUpdate}
                    </span>
                )
            }

            const monthNumber = new Intl.DateTimeFormat(
                'en-US', { month: 'numeric' }
            ).format(
                new Date(`${month} 1, 2000`)
            );

            const translatedMonth = {
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
            }[month.toLowerCase()];

            const formattedDate = `${!splitData || !hyperlinks ? 'Data' : ''}|${day}|${translatedMonth}|${cleanYear}`;

            function openPages(event: React.MouseEvent)
            {
                event.preventDefault();
                
                window.open(
                    `https://secure.runescape.com/m=news/l=3/a=9/archive?year=${year}&month=${monthNumber}&filter=Filtrar`, 
                    '_blank'
                ); 
                
                if (rswData)
                    window.open(
                        `https://pt.runescape.wiki/w/${day}_de_${translatedMonth}`, 
                        '_new'
                    );
            }

            return (
                <span>
                    {formattedFirstPart()}
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
                        <a href = '#' onClick = {openPages}>
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
        
            const monthNumber = new Intl.DateTimeFormat(
                'en-US', { month: 'numeric' }
            ).format(
                new Date(`${month} 1, 2000`)
            );

            const translatedMonth = {
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
            }[month.toLowerCase()];

            const formattedDate = `${!splitData || !hyperlinks ? 'Data' : ''}|${day}|${translatedMonth}|${year}`;

            function openPages(event: React.MouseEvent)
            {
                event.preventDefault();
                
                window.open(
                    `https://secure.runescape.com/m=news/l=3/a=9/archive?year=${year}&month=${monthNumber}&filter=Filtrar`, 
                    '_blank'
                ); 

                if (rswData)
                    window.open(
                        `https://pt.runescape.wiki/w/${day}_de_${translatedMonth?.toLowerCase()}`, 
                        '_new'
                    );
            }

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
                        <a href = '#' onClick = {openPages}>
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
            const isArticleBody = line.startsWith('¬¬');

            if (isArticleBody && removeBody)
                return undefined;

            const text = line.slice(isArticleBody ? 2 : 1);

            const isNavbox = !text.includes('|') && text.startsWith('{{');
            const isCategory = !text.startsWith('[[File:') && text.startsWith('[[');

            const color = (isNavbox && diffNavboxes) ? '#7b8eff' 
                        : (isCategory && diffCategories) ? '#ff8ebe' 
                        : (!aggressive) ? '#ff5a5a' 
                        : undefined;

            const style = {
                ...(aggressive && { background: '#ca4c4c' }),
                fontWeight: 'bold', 
                color: color
            };
    
            return (
                <span 
                    style = {untranslated ? style : undefined}
                >
                    {text}
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

            if (!paramValue) 
            {
                if (!untranslated) 
                    return !firstHalf.startsWith('{') ? `|${firstHalf}` : firstHalf;

                return (
                    <span>
                        {firstHalf.startsWith('{') ? '' : '|'}
                        {`|${firstHalf}` !== paramName ? renderUntranslatedSpan(firstHalf) : firstHalf}
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
                    {`|${firstHalf}` !== paramName ? renderUntranslatedSpan(firstHalf) : firstHalf}
                    {' = '}
                    {secondHalf !== paramValue ? renderUntranslatedSpan(secondHalf) : secondHalf}
                </span>
            );
        }

        // Template name hyperlink.
        const isSwitch = /^\|item[1-9] = §/.test(line);
        if (line.startsWith('§') || isSwitch)
        {
            const lineWithoutPrefix = isSwitch ? line.slice(10) : line.slice(1);

            if (!hyperlinks)
                return lineWithoutPrefix;

            const splittedLine = lineWithoutPrefix.split('|');
            const formattedLine = splittedLine[0].slice(2);

            return (
                <span>
                    {isSwitch && line.slice(0, 9)}
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
                {translation.map((line, index) => {
                    // No <br/> would be added because those 
                    // two will return as falsy from formatLine().
                    if (line === '¬¬' || line === '') 
                        return <br key = {index}/>;
                    
                    const formattedLine = formatLine(line);
                    return (
                        <React.Fragment key = {index}>
                            {formattedLine}
                            {formattedLine && <br/>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}