import { DataFormatter } from "./dataFormatter";

export function formatClipboard(textLines: string[])
{
    const CHARS_TO_REMOVE = ['&', '§', '$', '¬', '¬¬', '%', '@'];

    return textLines.map(str => 
    {
        if (str.startsWith('*') && !str.startsWith('**'))
        {
            const { firstPart, day, translatedMonth, cleanYear } = DataFormatter.cleanULDate(str);
            const [beginning, updateText] = firstPart.split('=&');
            const [cleanUpdText, restPastUpdate] = updateText.split('|');

            return `${beginning}=${cleanUpdText}|${restPastUpdate}data={{Data|${day}|${translatedMonth}|${cleanYear}}}`;
        }

        if (str.startsWith('%'))
        {
            const { paramName, day, translatedMonth, year } = DataFormatter.cleanInfoboxDate(str);
            return `${paramName} = {{Data|${day}|${translatedMonth}|${year}}}`;
        }

        let modifiedStr = str;
        
        while (CHARS_TO_REMOVE.some(char => modifiedStr.startsWith(char))) 
        {
            const match = CHARS_TO_REMOVE.find(char => modifiedStr.startsWith(char));
            modifiedStr = match ? modifiedStr.slice(match.length) : modifiedStr;
        }
        
        // Very unoptimized, but this whole function isn't called ofter so w/e.
        modifiedStr = modifiedStr
            .replace('=&', '=')
            .replace(' = &', ' = ')
            .replace(/¢/g, '');

        return modifiedStr;
    }).join('\n');
}
