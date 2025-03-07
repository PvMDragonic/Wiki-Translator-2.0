import { IWikiItems } from "src/api/wiki";

export class FileName
{
    // Couldn't cook any regex to do this specific thing.
    static #splitOutsideBrackets(input: string): string[] 
    {
        let result = [];
        let buffer = '';
        let depth = 0;
    
        for (let i = 0; i < input.length; i++) 
        {
            let char = input[i];
    
            if (char === '[' && input[i + 1] === '[') // Detect opening brackets [[.
            {
                depth++;
                buffer += char;
            }
            else if (char === ']' && input[i + 1] === ']') // Detects closing brackets ]].
            {
                depth--;
                buffer += char;
            }
            else if (char === '|' && depth === 0) // Split at | only if it's outside of [[ ]].
            {
                result.push(buffer);
                buffer = '';
            } 
            else // Adds character to buffer.
            {
                buffer += char;
            }
        }
    
        // Push the remaining buffer.
        if (buffer) result.push(buffer);
    
        return result;
    }

    static #formatFileName(itemNames: IWikiItems, fileName: string): string
    {
        const suffixMap: Record<string, string> = 
        {
            'detail': 'detalhe',
            'chathead': 'cabeça'
        };
        
        for (let suffix in suffixMap) 
        {
            if (fileName.endsWith(suffix)) 
            {
                const name = fileName.slice(0, -suffix.length).trim();
                const translated = itemNames[name];

                return translated 
                    ? `[[Arquivo:${translated} ${suffixMap[suffix]}`
                    : `[[Arquivo:¢${name}¢ ${suffixMap[suffix]}`;
            }
        }

        const translated = itemNames[fileName];
        return translated 
            ? `[[Arquivo:${translated}`
            : `[[Arquivo:¢${fileName}¢`;
    }

    static #formatFinalPart(finalPart: string): string
    {
        const splittedAttributes = this.#splitOutsideBrackets(finalPart);
        if (splittedAttributes.length > 2 && splittedAttributes.some(str => str.length >= 10))
        {
            const fileDescription = splittedAttributes.find(str => str.length >= 10);
            if (fileDescription)
            {
                const descriptionIndex = splittedAttributes.findIndex(str => str === fileDescription);
                const finalFirstHalf = splittedAttributes.slice(0, descriptionIndex - 1).join('|');
                const finalSecondHalf = descriptionIndex !== splittedAttributes.length - 1 
                    ? fileDescription + '¢|' + splittedAttributes.slice(descriptionIndex + 1).join('|')
                    : fileDescription.slice(0, -2) + '¢]]'; 
    
                return finalFirstHalf + '|¢' + finalSecondHalf;
            }
        }

        return finalPart;
    }

    static translate(itemNames:IWikiItems, textLine: string): string
    {
        const match = textLine.match(/\.(?:gif|png)/);

        if (match)
        {
            const finalPartIndex = (textLine.indexOf(match[0]) + match[0].length - 1) - 3; // 4 is to rip the file ext aswell.
            const itemName = textLine.slice(7, finalPartIndex);
            const fileExtension = textLine.slice(finalPartIndex);

            return this.#formatFileName(itemNames, itemName) + this.#formatFinalPart(fileExtension);
        }

        return textLine;
    }
}