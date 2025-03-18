import { useContext } from "react";
import { DataFormatter } from "./dataFormatter";
import SettingsContext from "@pages/Home/settingsContext";

interface IFormatLine
{
    line: string
}

/**
 * Formats the JSX based on the markings inside the given text line.
 */
export function FormatLine({ line }: IFormatLine): React.ReactNode
{
    const { 
        hyperlinks, splitData, rswData, 
        removeBody, untranslated, diffExamine, 
        diffNavboxes, diffCategories, aggressive 
    } = useContext(SettingsContext);

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

    function formatUpdateLine()
    {
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

    function formatDateUpdateLine()
    {
        const { 
            firstPart, day, monthNumber, translatedMonth, cleanYear, restFromYear
        } = DataFormatter.cleanULDate(line);

        function openPages(event: React.MouseEvent)
        {
            event.preventDefault();
            
            window.open(
                `https://secure.runescape.com/m=news/l=3/a=9/archive?year=${cleanYear}&month=${monthNumber}&filter=Filtrar`, 
                '_blank'
            ); 
            
            if (rswData)
                window.open(
                    `https://pt.runescape.wiki/w/${day}_de_${translatedMonth}`, 
                    '_new'
                );
        }

        const [beginning, updateText] = firstPart.split('=&');
        const [cleanUpdText, restPastUpdate] = updateText.split('|');
        const formattedDate = `${!splitData || !hyperlinks ? 'Data' : ''}|${day}|${translatedMonth}|${cleanYear}`;

        return (
            <span>
                <span>
                    {beginning}
                    =
                    {untranslated ? renderUntranslatedSpan(cleanUpdText) : cleanUpdText}
                    |
                    {restPastUpdate}
                </span>
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
                {restFromYear}
            </span>
        )
    }

    function formatDate()
    {
        const {
            paramName, day, monthNumber, translatedMonth, year
        } = DataFormatter.cleanInfoboxDate(line)

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

    function formatExamineInfobox()
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

    function formatArticleBody()
    {
        const isArticleBody = line.startsWith('¬¬');
    
        if (isArticleBody && removeBody)
            return null;

        const text = line.slice(isArticleBody ? 2 : 1);

        const isNavbox = !text.includes('|') && /^\{\{[a-zA-Z ]+\}\}$/.test(text);
        const isCategory = !text.startsWith('[[File:') && text.startsWith('[[') && text.endsWith(']]');

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

    function formatFile()
    {
        if (!untranslated)
            return line.replace(/¢/g, '');
        
        return line.split('¢').map((part, index) => {
            if (index % 2 === 0) 
                return (
                    <span key = {`${part}${index}`}>
                        {part}
                    </span>
                );

            return (
                <span key = {`${part}${index}`}>
                    {renderUntranslatedSpan(part)}
                </span>
            )
        });
    }

    function formatUntranslated()
    {
        const [paramName, paramValue] = line.split(' = ');

        if (paramName.endsWith('&&') && !paramValue)
        {
            return (
                <span>
                    {'|'}
                    {renderUntranslatedSpan(paramName.slice(2, -2))}
                </span>
            )
        }

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

    function formatSingleLineTemplateName()
    {
        const lineWithoutPrefix = line.slice(1);

        if (!hyperlinks)
            return lineWithoutPrefix;
        
        const [templateName, ...paramValues] = lineWithoutPrefix.split('|');
        const noParamTemplate = paramValues.length === 0;
        const formattedLine = noParamTemplate 
            ? templateName.slice(2, -2) 
            : templateName.slice(2);

        return (
            <span>
                {'{{'}
                <a 
                    href = {`https://pt.runescape.wiki/w/Predefinição:${formattedLine}`} 
                    target = '_blank'
                >
                    {formattedLine}
                </a>
                {noParamTemplate ? '}}' : '|'}
                {paramValues !== undefined && paramValues.join('|')}
            </span>
        );
    }

    function formatSingleLineTemplate()
    {
        const [templateName, ...templateParams] = line.split('|');
    
        return (
            <>
                {FormatLine({ line: templateName })}
                {templateParams.map((param, index) => (
                    // Only formats if not a translated item name.
                    <span key = {param + index}>
                        {param.startsWith('&') ? FormatLine({ line: `|${param}` }) : `|${param}`}
                    </span>
                ))}
                {'}}'}
            </>
        )
    }

    function formatTemplateHyperlink()
    {
        const isSwitch = /^\|item[1-9] = §/.test(line);
        const lineWithoutPrefix = isSwitch ? line.slice(10) : line.slice(1);

        if (!hyperlinks)
            return lineWithoutPrefix;

        const formattedLine = lineWithoutPrefix.slice(2);

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
            </span>
        );  
    }

    function selectFormatting()
    {
        switch (true)
        {
            case line.startsWith('**'):
                return formatUpdateLine();
        
            case line.startsWith('*') && !line.startsWith('**'):
                return formatDateUpdateLine();
        
            case line.startsWith('%'):
                return formatDate();
        
            case line.startsWith('$'):
                return formatExamineInfobox();
        
            case line.startsWith('¬'):
                return formatArticleBody();
        
            case line.startsWith('[[Arquivo:') || /^\|[\p{L}0-9 ]*=\s*\[\[Arquivo:/gu.test(line):
                return formatFile();
        
            case line.startsWith('|&') || line.startsWith('&') || line.includes(' = &'):
                return formatUntranslated();
        
            case line.startsWith('@'):
                return formatSingleLineTemplateName();
        
            case line.startsWith('§') && line.includes('|'):
                return formatSingleLineTemplate();
        
            case line.startsWith('§') || /^\|item[1-9] = §/.test(line):
                return formatTemplateHyperlink();
        
            default:
                return <span>{line}</span>;
        }
    }

    // Blank or simply empty newline.
    if (line === '¬¬' || line === '') 
        return <br/>;

    const returnValue = selectFormatting();

    return (
        <>
            {returnValue}
            {returnValue && <br/>}
        </>
    )
}