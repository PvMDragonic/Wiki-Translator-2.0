import { IWikiItems, IWikiTemplates } from "./wiki";

interface ITranslate
{
    textToTranslate: string;
    templates: IWikiTemplates;
    itemNames: IWikiItems;
    debugging: boolean;
    debugSplitted: boolean;
    debugTemplate: boolean; 
    debugSuccess: boolean;
    debugSkipped: boolean; 
    debugMissing: boolean;
}

export async function translate({ 
    textToTranslate,
    templates,
    itemNames, 
    debugging, 
    debugSplitted, 
    debugTemplate,
    debugSuccess, 
    debugSkipped, 
    debugMissing 
}: ITranslate) 
{
    function extractInputData(text: string)
    {
        // Some get here starting with '{{' and some do not.
        const templateName = text.split('|')[0].replace(/^{{/, '').trim();
        const templateEntries = text.split('\n').slice(1, -1).map(entry => 
        {
            const [key, value] = entry.split('=').map(
                splitted => (splitted.startsWith('|') 
                    ? splitted.slice(1) 
                    : splitted
                ).trim()
            );

            return { 
                paramName: key,
                paramValue: value
            };
        });

        return {
            templateName, 
            templateEntries
        };
    }

    function handleUnconventional(text: string, templateName: string)
    {
        // Categories will fall here.
        if (text.startsWith('[['))
        {
            if (debugging && debugSuccess) console.log('Category found:',
                '\n\ttemplateName: ',
                templateName,
                '\n\ttext: ', 
                text);
            return '&' + text.split('\n');
        }
        
        // Navboxes will fall here.
        if (!text.includes('|') && text !== '')
        {
            if (debugging && debugSuccess) console.log('Navbox found:',
                '\n\ttemplateName: ',
                templateName,
                '\n\ttext: ', 
                text);
            return [`{{${text}}}`]
        }

        const translatedParamName = itemNames[text.split('|')[1]];
        if (translatedParamName)
        {
            if (debugging && debugSuccess) console.log(
                'Unconventional translated:',
                '\n\ttemplateName: ',
                templateName,
                '\n\ttranslatedParamName: ', 
                translatedParamName);

            // § is used to mark templates to have hyperlinks added to them.
            return [`§{{${templateName}|${translatedParamName}}}`];
        }

        if (debugging && debugMissing) console.log(
            'Missing unconventional:',
            '\n\ttemplateName: ',
            templateName,
            '\n\ttext: ', 
            text);
        return '&' + text.split('\n');
    }

    function handleUpdateHistory(textLines: string[])
    {
        function translateUpdateLine(textLine: string)
        {
            return `${textLine
                .replace('UL', 'LA')
                .replace('type=', 'tipo=')
                .replace('update=', 'atualização=')
                .replace('date=', 'data=')
                .replace('=patch', '=correção')
                .replace('=update', '=atualização')
            }}}`; // All {{UL}} lose their closing brackets after the 'textToTranslate' split.
        }

        const updateHistory = textLines.flatMap((textLine, i) => 
        {
            if (i === 0) 
            {
                const [firstLine, secondLine] = textLine.split('\n');

                return [
                    firstLine.startsWith('{') 
                        // A single, clean {{UH}} input will already have brackets; else, it won't.
                        ? firstLine.replace('UH', 'HA') 
                        : `{{${firstLine.replace('UH', 'HA')}`, 
                    translateUpdateLine(secondLine)
                ];
            }

            if (textLine.startsWith('*')) 
            {
                return textLine.split('\n').map(line => 
                    line.startsWith('* {') 
                        ? translateUpdateLine(line) 
                        : line
                );
            }

            return []; // Effectively stops processing for any other cases.
        });

        // Need to add back the bracket removed from splitting 'textToTranslate'.
        updateHistory[updateHistory.length - 1] = '}}';
        return updateHistory;
    }

    // Removes trailing newlines, then splits by newline double bracket ending with double bracket newline not followed by a pipe.
    const splitted = textToTranslate.replace(/\n+$/, '').split(/\n{{|}}\n(?!\|)/).filter(text => text !== '');
    
    if (debugging && debugSplitted) console.log('splitted array:\n\t', splitted);

    return splitted.map((text, index) => 
    {
        // Unsupported and unconventional template.
        if (text.startsWith('GU'))
        {
            if (debugging && debugSkipped) console.log(
                'Skipping GU:', 
                '\n\t\'splitted\' index: ',
                index,
                '\n\ttext: ', 
                text);
            return [null];
        }

        if (text.startsWith('{{UH') || text.startsWith('UH'))
            return handleUpdateHistory(splitted.slice(index));

        // Handles rogue {{UL}}, since they're already dealt with alongside {{UH}}.
        if (text.startsWith('*'))
        {
            // If there's relevant stuff past the {{UH}} that's not a 
            // template, it may get stuck together with the last {{UL}}.
            const leftoverText = text
                .split('\n')
                .filter(textLine => !textLine.startsWith('*'))
                .map(line => line.startsWith('=') || line.startsWith('[') || line === '' ? line : `{{${line}}}`);

            // Undesireable leftovers are either empty arrays (['']) or brackets from splitting (['}}']).
            if (leftoverText.length === 1 && leftoverText[0].length <= 2)
            {
                if (debugging && debugSkipped) console.log(
                    'Skipping UL:', 
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text);
                return [null];
            }            

            if (debugging && debugSuccess) console.log(
                'Leftover found:', 
                '\n\t\'splitted\' index: ',
                index,
                '\n\ttext: ', 
                text);
            return leftoverText;
        }

        // 'splitted' will have only one element when a single, clean template is inputted.
        // This is also why trailing newlines need to be removed, to properly detect a single template.
        if (index % 2 === 0 && splitted.length > 1) 
            return '&' + text.split('\n');

        // Extracts data from {{Infobox Bonuses|param = value|param2 = value2|etc...}}
        const { templateName, templateEntries } = extractInputData(text);

        // On occasion, stuff like [[Categories]] may get on odd indexes and making it here.
        if (templateEntries.some(entry => entry.paramValue === undefined))
        {
            if (debugging && debugSkipped) console.log(
                'Skipping empty param values:', 
                '\n\t\'splitted\' index: ',
                index,
                '\n\ttext: ', 
                text);
            return '&' + text.split('\n');
        }

        const templateData = templates[templateName];

        if (debugging && debugTemplate)
        {
            console.log(
                'Template found:',
                '\n\t\'splitted\' index: ', 
                index, 
                '\n\ttemplateName: ', 
                templateName, 
                '\n\ttemplateEntries: ', 
                templateEntries, 
                '\n\ttemplateData: ', 
                templateData
            );
        }

        // Unconventional templates like {{Uses material list}} don't have a set of key:value params.
        if (templateEntries.length === 0)
        {
            // Some junk gets here when a whole article is thrown at the translator.
            if (text.startsWith('\n') || text.startsWith(''))
            {
                if (debugging && debugSkipped) console.log(
                    'Skipping junk on unconventional:', 
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text);
                return '&' + text.split('\n');
            }

            const _templateName = templateData ? templateData.templateName : templateName;
            return handleUnconventional(text, _templateName);
        }

        const translatedInput = templateEntries.map(entry =>
        {
            const name = entry.paramName;
            const value = entry.paramValue;

            const translatedParam = (() => 
            {
                try
                {
                    const translatedParam = templateData.templateParams[name];
                    if (!translatedParam) // Wiki .json is lacking a given param.
                        return false;
                    
                    return templateData.templateParams[name];
                }
                catch(error)
                {
                    // Wiki .json is also lacking a given param.
                    return false;
                }
            })();

            if (!translatedParam)
            {
                if (debugging && debugMissing) 
                    console.log(
                        'Wiki .json missing: ', 
                        '\n\t\'splitted\' index: ', 
                        index,
                        '\n\ttemplateName: ',
                        templateName,
                        '\n\tparamName: ',
                        name,
                        '\n\tparamValue: ',
                        value
                    );

                // & marks stuff left untranslated, unless it's solely a number.
                return `|&${name} = ${!(/^[(),.\d]+$/.test(value)) ? `&${value}` : value}`;
            }

            const correctedParam = translatedParam ? translatedParam : `&${name}`; 

            // Needs to be an exception to paint it a different color.
            if (correctedParam.startsWith('exam'))
                return `$|${correctedParam} = ${value}`;

            // Templates with untranslatable values, like {{Disassembly}}, may not have 'templateValues'.
            const correctedValue = templateData.templateValues?.[name]?.[value.toLowerCase()] || 
                // Marks values that aren't solely numbers with an '&' to be properly formatted on <TextOutput>.
                (!(/^[(),.\d]+$/.test(value)) ? `&${value}` : value);

            // Brute force translation since hash tables are O(1).
            if (correctedValue === `&${value}`)
            { 
                try
                {
                    if (value.includes('equipped'))
                    {
                        const cleanValue = value.split('equipped')[0].trim();
                        return `|${correctedParam} = ${itemNames[cleanValue]} equipado.png`;
                    }
    
                    if (value.includes('.png') || value.includes('.gif'))
                    {
                        const cleanValue = value.split('.');
                        return `|${correctedParam} = ${itemNames[cleanValue[0].trim()]}.${cleanValue[1]}`;
                    }
    
                    // Mostly for {{Infobox Recipe}} with all its |mat(s) and |output(s).
                    const itemName = itemNames[value];
                    if (itemName !== undefined)
                        return `|${correctedParam} = ${itemName}`;
                }
                finally
                {
                    if (debugging && debugSuccess) console.log(
                        'Item name translation:',
                        '\n\tparamName: ',
                        name,
                        '\n\tcorrectedValue: ',
                        correctedValue
                    )
                }
            }        
            
            if (debugging && debugSkipped) console.log(
                'Skipping item name translation:',
                '\n\tparamName: ',
                name,
                '\n\tcorrectedValue: ',
                correctedValue
            )

            return `|${correctedParam} = ${correctedValue}`;
        });

        // § is used to mark templates to have hyperlinks added to them.
        return [
            `§{{${templateData.templateName}`, 
            ...translatedInput, 
            '}}'
        ];
    }).flat().filter(line => line !== null);
}