import { IWikiItems, IWikiTemplates, Wiki } from "../../api/wiki";

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
        let templateName = text.split('|')[0].replace(/^{{/, '').trim();
        templateName = templateName[0].toUpperCase() + templateName.slice(1);

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

    function translateFileName(textLine: string): string[]
    {
        const match = textLine.match(/\.(?:gif|png)/);

        if (match)
        {
            const finalPartIndex = (textLine.indexOf(match[0]) + match[0].length - 1) - 3; // 4 is to rip the file ext aswell.
            const finalPart = textLine.slice(finalPartIndex);
            const itemName = textLine.slice(7, finalPartIndex); 
            
            return [itemName, finalPart];
        }

        return [];
    }

    function splitRawInput()
    {
        const splitted = textToTranslate.split('\n');

        for (let i = 0; i < splitted.length; i++)
        {
            // Article body; headers; categories; etc.
            if (!splitted[i].startsWith('{{'))
                continue;

            // One-line Templates, like {{Clear}} or {{Price per dose}}.
            if (splitted[i].endsWith('}}'))
                continue;

            const isSwitch = splitted[i].startsWith('{{Switch infobox');
            const baseString = splitted[i];
            const collected: string[] = [];
            const startingIndex = i + 1;
            let spliceLen = 0;

            for (let j = startingIndex; j < splitted.length; j++)
            {    
                const curr = splitted[j];

                if (curr.startsWith('|') || curr.startsWith('*') || curr === '')
                {
                    // Can't use 'collected.lenght' because of paramValuesAmount.
                    spliceLen++;

                    const paramValuesAmount = curr
                        .split(/\|(?![^\[]*])/) // The | is matched only if it's not followed by a ], due to [[File:name.png|100px|left]].
                        .slice(1); // First elem after the split is always an empty string.

                    if (paramValuesAmount.length > 1 && !curr.startsWith('*')) // Needs to ignore {{UL}}.
                    {
                        paramValuesAmount.forEach(
                            paramValue => collected.push(`|${paramValue}`)
                        );
                    }
                    else collected.push(curr);
                }
                else 
                {
                    if (isSwitch)
                    {
                        if (curr !== '}}' || splitted[j + 1] !== '}}')
                        {
                            // Needs to account for each }} at the end of each '|item'.
                            collected.push('}}');
                            spliceLen++;
                            continue;
                        }
                    }
                        
                    break;
                }
            }

            const len = collected.length;

            // Closing brackets on the same line as last param leaves a blank last elem.
            const closingSameLine = collected[len - 1] === '';
            
            if (!closingSameLine && !isSwitch)
                collected.push('}}');

            if (isSwitch)
            {
                collected.push('}}');
                collected.push('}}');
            }

            if (len > 0)
                splitted[i] = baseString + '\n' + collected.join('\n');
            
            if (isSwitch)
                splitted.splice(
                    startingIndex,
                    spliceLen + 2
                )
            else
                splitted.splice(
                    startingIndex,
                    closingSameLine ? spliceLen : spliceLen + 1
                );
        }

        return splitted;
    }

    const splitted = splitRawInput();

    if (debugging && debugSplitted) 
        console.log('splitted array:\n\t', splitted);

    return await Promise.all(splitted.map(async (text, index) => 
    {
        if (text.startsWith('='))
        {
            const headers: Record<string, string> = {
                '==creation==': '==Criação==',
                '==combat stats==': '==Estatísticas de Combate==',
                '==special attack==': '==Ataque Especial==',
                '==price per dose==': '==Preço por dose==',
                '==products==': '==Utilização==',
                '==repair==': '==Reparo==',
                '==history==': '==História==',
                '==drops==': '==Objetos Largados==',
                '==update history==': '==Histórico de Atualizações==',
                '==achievements==': '==Conquistas==',
                '==drop sources==': '==Obtenção==',
                '==disassembly==': '==Desmontar==',
                '==shop locations': '==Locais de lojas==',
                '==dialogue==': '==Diálogo==',
                '==gallery==': '==Galeria==',
                '==trivia==': '==Curiosidades==\n',
                '==references==': '==Referências=='
            }; 

            const translatedHeader = headers[text.toLowerCase()];
            if (translatedHeader)
            {
                if (debugging && debugSuccess) 
                    console.log(
                        'Header successfully translated:',
                        '\n\t\'splitted\' index: ',
                        index,
                        '\n\ttext: ', 
                        text
                    );

                return [translatedHeader];
            }

            if (debugging && debugSkipped) 
                console.log(
                    'Unknown header skipped:',
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );

            return ['¬' + text];
        }
        
        if (!text.startsWith('{{'))
        {
            if (text.startsWith('[[File:'))
            {
                const [itemName, finalPart] = translateFileName(text);

                if (itemName && finalPart)
                {
                    if (itemName.endsWith('detail'))
                        return [`[[Arquivo:${itemNames[itemName.slice(0, itemName.length - 7)]} detalhe${finalPart}`];
                    
                    return [`[[Arquivo:${itemNames[itemName]}${finalPart}`];
                }
            }

            if (debugging && debugSkipped) 
                console.log(
                    'Skipping article body:', 
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );
                
            return text.startsWith('[[')
                ? text.split('\n').map(line => '¬' + line)
                : text.split('\n').map(line => '¬¬' + line);
        }

        // Unsupported and unconventional template.
        if (text.startsWith('{{GU'))
        {
            if (debugging && debugSkipped) 
                console.log(
                    'Skipping GU:', 
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );
            return '';
        }

        if (text.startsWith('{{UH'))
        {
            if (debugging && debugSuccess) 
                console.log(
                    'UH found:',
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );

            const replacements: Record<string, string> = 
            {
                'UH': 'HA',
                'UL': 'LA',
                'type=': 'tipo=',
                'update=': 'atualização=&',
                'date=': 'data=',
                '=patch': '=correção',
                '=update': '=atualização'
            };

            let translation = text;
            for (const [search, replace] of Object.entries(replacements)) 
            {
                const regex = new RegExp(search, 'g');
                translation = translation.replace(regex, replace);
            }

            return translation.split('\n');
        }

        if (text.startsWith('{{Switch infobox'))
        {
            if (debugging && debugSuccess) 
                console.log(
                    '{{Switch infobox}} found:',
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );

            const splitted = text.split('\n|item');

            const result: string[] = await Promise.all(splitted.map(async (line, index) =>
            {
                if (!line.startsWith('{{Switch infobox')) 
                {
                    const sliceLimit = line.indexOf('{');
                    const stringStart = line.slice(0, sliceLimit);

                    const splittedLine = line.split(/\n\|text[0-9] = /);
                    const isntLastItem = splittedLine.length === 2;
                    
                    const translatedTextName = itemNames[splittedLine[1]] || `&${splittedLine[1]}`;

                    const stringEnd = isntLastItem 
                        ? `\n|text${index + 1} = ${translatedTextName}` 
                        : '';

                    const toTranslate = isntLastItem 
                        ? splittedLine[0].slice(sliceLimit)
                        : splittedLine[0].slice(sliceLimit, splittedLine[0].length - 6);

                    const translated = await translate({ 
                        textToTranslate: toTranslate,
                        templates,
                        itemNames, 
                        debugging, 
                        debugSplitted, 
                        debugTemplate,
                        debugSuccess, 
                        debugSkipped, 
                        debugMissing  
                    });

                    translated[0] = stringStart + translated[0];
                    return translated.join('\n') + stringEnd;
                }

                const [templateHeader, textOneName] = line.split(/\n\|text[0-9] = /);
                const header = templateHeader.replace('Switch infobox', 'Alterar Infobox');
                const textOne = itemNames[textOneName] || `&${textOneName}`;
                return `${header}\n|text1 = ${textOne}`;
            }));

            return ('§' + result.join('\n|item') + '\n}}').split('\n');
        }
            
        if (!text.includes('|'))
        {
            if (debugging && debugSkipped) 
                console.log(
                    'Skipping navbox:',
                    '\n\t\'splitted\' index: ',
                    index,
                    '\n\ttext: ', 
                    text
                );

            return ['¬' + text];
        }

        // Extracts data from {{Infobox Bonuses|param = value|param2 = value2|etc...}}
        const { templateName, templateEntries } = extractInputData(text);

        const templateData = templates[templateName];
        if (!templateData)
        {
            if (debugging && debugMissing) 
                console.log(
                    'Wiki .json missing Template: ', 
                    '\n\t\'splitted\' index: ', 
                    index,
                    '\n\ttemplateName: ',
                    templateName
                );

            return text.split('\n').map(line => '¬' + line);
        }
        else
        {
            if (debugging && debugTemplate)
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
            const itemName = text.split('|')[1];
            const translatedParamName = itemNames[itemName.slice(0, itemName.length - 2)];
            
            if (translatedParamName)
            {
                if (debugging && debugSuccess) 
                    console.log(
                        'Unconventional translated:',
                        '\n\ttemplateName: ',
                        templateName,
                        '\n\ttranslatedParamName: ', 
                        translatedParamName
                    );
    
                // § is used to mark templates to have hyperlinks added to them.
                return `§{{${templateName}|${translatedParamName}}}`;
            }
    
            if (debugging && debugSkipped) 
                console.log(
                    'Empty template found:',
                    '\n\ttemplateName: ',
                    templateName,
                    '\n\ttext: ', 
                    text
                );

            return text.split('\n').map(line => '¬' + line);
        }

        const translatedInput = await Promise.all(templateEntries.map(async entry =>
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
                        'Wiki .json missing param: ', 
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
            {
                const currNumber = correctedParam.charAt(correctedParam.length - 1);
                const targetParam = !isNaN(Number(currNumber)) ? `name${currNumber}` : 'name';
                const itemName = templateEntries.find(obj => obj.paramName === targetParam)?.paramValue;
                const examine = await Wiki.requestItemExamine(itemNames[itemName!]);
                if (examine)
                    return `|${correctedParam} = ${examine}`;

                return `$|${correctedParam} = ${value}`;
            }

            if (/^[(),.\d]+$/.test(value))
            {
                if (debugging && debugSkipped) 
                    console.log(
                        'Skipping numeric param value:',
                        '\n\tparamName: ',
                        name,
                        '\n\tparamValue: ',
                        value
                    );

                return `|${correctedParam} = ${value}`;
            }

            // Templates with untranslatable values, like {{Disassembly}}, may not have 'templateValues'.
            const correctedValue = templateData.templateValues?.[name]?.[value.toLowerCase()];
            if (correctedValue) 
                return `|${correctedParam} = ${correctedValue}`; 

            const translatedParamValue = (() => 
            {
                // Starts with [[ followed by one or two numbers and a space.
                if (/^\[\[\d{1,2}/.test(value))
                {
                    // Splits "[[25 November]] [[2020]]" into ["25", "November", "2020"].
                    const [day, month, year] = value.split(' ').map(part => part.replace(/\[\[|\]\]/g, ''));

                    // Scuffed return because it gets formatted on <TextOutput>.
                    return `%|${correctedParam} = ${day} = ${month} = ${year}`;
                }

                if (value.startsWith('[[File'))
                {
                    const [itemName, finalPart] = translateFileName(value);

                    if (itemName && finalPart)
                    {
                        if (itemName.endsWith('detail'))
                            return `|${correctedParam} = [[Arquivo:${itemNames[itemName.slice(0, itemName.length - 7)]} detalhe${finalPart}`;
                        
                        return `|${correctedParam} = [[Arquivo:${itemNames[itemName]}${finalPart}`;
                    }
                }
                
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

                return false;
            })();

            if (translatedParamValue)
            {
                if (debugging && debugSuccess) 
                    console.log(
                        'Successful param value translation:',
                        '\n\tparamName: ',
                        name,
                        '\n\tparamValue: ',
                        correctedValue
                    );
                    
                return translatedParamValue;
            }

            if (!value)
            {
                if (debugging && debugSkipped) 
                    console.log(
                        'Skipping param left blank:',
                        '\n\tparamName: ',
                        name
                    );

                return `|${correctedParam} = `;
            }

            if (debugging && debugSkipped) 
                console.log(
                    'Skipping param value translation:',
                    '\n\tparamName: ',
                    name,
                    '\n\tparamValue: ',
                    value
                );
            
            return `|${correctedParam} = &${value}`;
        }));

        // § is used to mark templates to have hyperlinks added to them.
        return [
            `§{{${templateData.templateName}`, 
            ...translatedInput, 
            '}}'
        ];
    })).then(value => value.flat());
}