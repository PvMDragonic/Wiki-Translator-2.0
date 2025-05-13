import { IWikiItems, IWikiTemplates, Wiki } from "src/api/wiki";
import { Debugger, IDebugger } from "./debugger";
import { FileName } from "./fileName";

interface ITranslate
{
    templates: IWikiTemplates;
    itemNames: IWikiItems;
    debugger: IDebugger;
}

export class Translation implements ITranslate
{
    debugger: Debugger;

    constructor(
        public templates: IWikiTemplates, 
        public itemNames: IWikiItems,
        { 
            debugging, debugSplitted, debugTemplate, 
            debugSuccess, debugSkipped, debugMissing
        }: IDebugger
    ) {
        this.debugger = new Debugger(
            debugging,
            debugSplitted,
            debugTemplate, 
            debugSuccess,
            debugSkipped, 
            debugMissing
        );
    }

    /**
     * Splits and agregates all that belongs to each template into a single line.
     */
    #splitRawInput(text: string): string[]
    {
        const splitted = text.split('\n');

        for (let i = 0; i < splitted.length; i++)
        {
            const curr = splitted[i];

            // Article body; headers; categories; etc.
            if (!curr.startsWith('{{'))
                continue;

            // One-line Templates, like {{Clear}} or {{Price per dose}}.
            if (curr.endsWith('}}'))
                continue;

            const isSwitch = curr.startsWith('{{Switch infobox') || curr.startsWith('{{Multi infobox');
            const baseString = curr;
            const collected: string[] = [];
            const startingIndex = i + 1;
            let spliceLen = 0;

            for (let j = startingIndex; j < splitted.length; j++)
            {    
                const nestCurr = splitted[j];

                if (nestCurr.startsWith('|') || nestCurr.startsWith('*') || nestCurr === '' || (isSwitch && splitted[j - 1].startsWith('|item')))
                {
                    // Can't use 'collected.lenght' because of paramValuesAmount.
                    spliceLen++;

                    // Ignores {{UL}} or cases where the param value is a Template itself.
                    if (!nestCurr.startsWith('*') && !nestCurr.includes(' = {{') && !nestCurr.includes('={{'))
                    {
                        const paramValuesAmount = nestCurr
                            .split(/\|(?![^\[]*])/) // The | is matched only if it's not followed by a ], due to [[File:name.png|100px|left]].
                            .slice(1); // First elem after the split is always an empty string.
    
                        // Catches poorly-formatted Templates with more than one paramValue per line.
                        if (paramValuesAmount.length > 1 && !nestCurr.startsWith('*'))
                        {
                            paramValuesAmount.forEach(
                                paramValue => collected.push(`|${paramValue}`)
                            );
    
                            continue;
                        } 
                    }

                    collected.push(nestCurr);
                }
                else 
                {
                    if (isSwitch)
                    {
                        if (nestCurr !== '}}' || splitted[j + 1] !== '}}')
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

    /**
     * Extracts 'templateName' and 'templateEntries' from a given {{Template|param1=value1|...}} string.
     */
    #extractInputData(text: string)
    {
        let templateName = text.split('|')[0].replace(/^{{/, '').replace(/}}$/, '').trim();
        templateName = templateName[0].toUpperCase() + templateName.slice(1);

        const splitNewline = text.split('\n');
        const splitPipe = text.split('|');
        const singleLineTemplate = splitNewline.length === 1 && splitPipe.length > 1;
        const splitted = singleLineTemplate ? splitPipe.slice(1) : splitNewline.slice(1, -1);

        const templateEntries = splitted.map(entry => 
        {
            const entrySplit = entry.split('=');

            // '...value' is to gather paramValues that are Templates; does nothing to regular param values.
            const [key, ...value] = entrySplit.map(
                splitted => (splitted.startsWith('|') 
                    ? splitted.slice(1) 
                    : splitted
                ).trim() // Needs to trim because 'param = value' leaves trailing and leading spaces.
            );

            return { 
                paramName: key,
                paramValue: value.join('=')
            };
        });

        if (singleLineTemplate)
        {
            // Removes trailing '}}', since its embedded into the last value from the last param.
            const lastIndex = templateEntries.length - 1;
            if (templateEntries[lastIndex].paramValue !== '')
                templateEntries[lastIndex].paramValue = templateEntries[lastIndex].paramValue.slice(0, -2);
            else
                templateEntries[lastIndex].paramName = templateEntries[lastIndex].paramName.slice(0, -2);
        }

        return {
            templateName, 
            templateEntries,
            singleLineTemplate
        };
    }

    #handleHeader(text: string, index: number)
    {
        const headers: Record<string, string> = {
            '==creation==': '==Criação==',
            '==combat stats==': '==Estatísticas de combate==',
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
            this.debugger.logSuccess('Header', index, text);
            return [translatedHeader];
        }

        this.debugger.logSkipped('Header', index, text);
        return ['¬' + text];
    }

    #handleFileCall(text: string, index: number)
    {
        const translatedFile = FileName.translate(this.itemNames, text);

        if (translatedFile.startsWith('[[Arquivo:¢'))
            this.debugger.logMissing('[[File]] name', index, text);

        if (translatedFile.startsWith('[[Arquivo:'))
            this.debugger.logSuccess('[[File]] name', index, text);

        return translatedFile;
    }

    #handleArticleBody(text: string, index: number)
    {
        if (text.startsWith('[[File:'))
            return [this.#handleFileCall(text, index)];

        this.debugger.logSkipped('Article body', index, text);

        return text.startsWith('[[') && text.endsWith(']]')
            ? text.split('\n').map(line => '¬' + line)
            : text.split('\n').map(line => '¬¬' + line);
    }

    #handleUpdateHistory(text: string, index: number)
    {
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

        this.debugger.logSuccess('{{UH}}', index, text);
        return translation.split('\n');
    }

    async #handleSwitchInfobox(text: string, index: number)
    {
        const isSwitchNotMulti = text.startsWith('{{Switch');

        this.debugger.logSuccess(`{{${isSwitchNotMulti ? '{{Switch' : '{{Multi'} infobox}}`, index, text);

        const splitted = text.split('\n|item');

        const result: string[] = await Promise.all(splitted.map(async (line, index) =>
        {
            if (!line.startsWith('{{Switch infobox') && !line.startsWith('{{Multi infobox')) 
            {
                const sliceLimit = line.indexOf('{');
                const stringStart = line.slice(0, sliceLimit);

                const splittedLine = line.split(/\n\|text[0-9] = /);
                const isntLastItem = splittedLine.length === 2;

                const translatedTextName = this.itemNames[splittedLine[1]] || `&${splittedLine[1]}`;

                const stringEnd = isntLastItem 
                    ? `\n${isSwitchNotMulti ? '|text' : '|texto'}${index + 1} = ${translatedTextName}` 
                    : '';

                const toTranslate = isntLastItem 
                    ? splittedLine[0].slice(sliceLimit)
                    : splittedLine[0].slice(sliceLimit, splittedLine[0].length - 6);

                const translated = await this.translate(toTranslate);

                translated[0] = stringStart + translated[0];
                return translated.join('\n') + stringEnd;
            }

            const [templateHeader, textOneName] = line.split(/\n\|text[0-9] = /);
            const textOne = this.itemNames[textOneName] || `&${textOneName}`;

            if (isSwitchNotMulti)
            {
                const header = templateHeader.replace('Switch infobox', 'Alterar Infobox');
                return `${header}\n|text1 = ${textOne}`;
            }
            else 
            {
                const header = templateHeader.replace('Multi infobox', 'Multi Infobox');
                return `${header}\n|texto1 = ${textOne}`;
            }
        }));

        return ('§' + result.join('\n|item') + '\n}}').split('\n');
    }

    async translate(textToTranslate: string)
    {
        const cleanInput = this.#splitRawInput(textToTranslate);

        this.debugger.logSplitted(cleanInput);

        return await Promise.all(cleanInput.map(async (text, index) => 
        {
            if (text.startsWith('='))
                return this.#handleHeader(text, index);
            
            if (!text.startsWith('{{'))
                return this.#handleArticleBody(text, index);
    
            if (text.startsWith('{{UH'))
                return this.#handleUpdateHistory(text, index);

            // Unsupported and unconventional template.
            if (text.startsWith('{{GU'))
            {
                this.debugger.logSkipped('{{GU}}', index, text);
                return undefined;
            }
    
            if (text.startsWith('{{Switch infobox') || text.startsWith('{{Multi infobox'))
                return this.#handleSwitchInfobox(text, index);
    
            const { templateName, templateEntries, singleLineTemplate } = this.#extractInputData(text);
            const templateData = this.templates[templateName];

            // Unknown Template was found.
            if (!templateData)
            {
                // Denotes a {{navbox}}.
                if (!text.includes('|') && text.startsWith('{{') && text.endsWith('}}'))
                {
                    this.debugger.logSkipped('Navbox', index, text);
                    return ['¬' + text];
                }
    
                this.debugger.logMissing('Wiki .json Template', index, templateName);
                return text.split('\n').map(line => '¬' + line);
            }
            else
            {
                this.debugger.logTemplate(index, templateName, templateEntries, templateData);
            }
    
            // Unconventional templates like {{Uses material list}} don't have a set of key:value params.
            if (templateEntries.length === 0)
            {    
                const itemName = text.split('|')[1];
                if (!itemName)
                {
                    this.debugger.logSuccess('No-params Template', index, templateName, templateData.templateName);
                    return `@{{${templateData.templateName}}}`;
                }
    
                const translatedParamName = this.itemNames[itemName.slice(0, itemName.length - 2)];
                
                if (translatedParamName)
                {
                    this.debugger.logSuccess('Unconventional Template', index, templateName, translatedParamName);
                    return `@{{${templateData.templateName}|${translatedParamName}}}`;
                }
        
                this.debugger.logSkipped('Empty Template', index, text);
                return text.split('\n').map(line => '¬' + line);
            }
    
            // Regular Templates that have many pairs of 'param = value', each on a newline, make it here.
            const translatedInput = await Promise.all(templateEntries.map(async entry =>
            {
                const name = entry.paramName;
                const value = entry.paramValue;

                // Params that are simply a name.
                if (name && value === '' && singleLineTemplate)
                {
                    const translatedItem = this.itemNames[name];
                    if (!translatedItem)
                    {
                        this.debugger.logMissingName(index, templateName, name);
                        return `|&${name}`;
                    }

                    return `|${translatedItem}`;
                }

                // Searches the wiki json for the paramName translation.
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
                    // Stuff like "* 1 [[Eye of newt]]" from the param "items" in {{Quest details}} gets here.
                    if (name.includes('*'))
                    {
                        const [asterisks, numOfItems, ...rest] = name.trim().split(/\s+/); // Split by one or more whitespaces.
                        
                        const itemNames = rest
                            .join(" ")
                            .split(/\[\[|\]\]/) // Split by both [[ and ]].
                            .filter(Boolean)
                            .map((itemName, index) => {
                                const translatedItemName = this.itemNames[itemName];
                                return translatedItemName 
                                    ? `[[${translatedItemName}]]` 
                                    : index % 2 === 0 // Actual item names are left on even indexes.
                                        ? `&[[${itemName}]]&`
                                        : itemName.length >= 15 // Probably a description/addendum.
                                            ? `&${itemName}&`
                                            : itemName;
                            })
                            .join('');

                        // The -- are markings for the <TextOutput> formatting.
                        if (itemNames)
                            return `${asterisks} ${numOfItems} ${itemNames}--`;

                        return `${name}--`;
                    }

                    this.debugger.logMissingParam(index, templateName, name, value);
                    return `|&${name} = ${!(/^[(),.\d]+$/.test(value)) ? `&${value}` : value}`;
                }
    
                const correctedParam = translatedParam ? translatedParam : `&${name}`; 
    
                // Handles 'examine' params.
                if (correctedParam.startsWith('exam'))
                {
                    const currNumber = correctedParam.charAt(correctedParam.length - 1);
                    const targetParam = !isNaN(Number(currNumber)) ? `name${currNumber}` : 'name';
                    const itemName = templateEntries.find(obj => obj.paramName === targetParam)?.paramValue;
                    const ptbrItemName = this.itemNames[itemName!];
    
                    if (ptbrItemName)
                    {
                        const examine = await Wiki.requestItemExamine(ptbrItemName);
                        if (examine)
                            return `|${correctedParam} = ${examine}`;
                    }
    
                    return `$|${correctedParam} = ${value}`;
                }
    
                // Is a paramValue is only a number (or a string representing one).
                if (/^[-(),.\d]+$/.test(value))
                {
                    this.debugger.logSkippedParam('Numeric param value', name, value);
                    return `|${correctedParam} = ${value}`;
                }
    
                // Templates with untranslatable values, like {{Disassembly}}, may not have 'templateValues'.
                const correctedValue = templateData.templateValues?.[name]?.[value.toLowerCase()];
                if (correctedValue) 
                    return `|${correctedParam} = ${correctedValue}`; 
    
                // Attempts to translate the paramValue.
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
                        return `|${correctedParam} = ${this.#handleFileCall(value, index)}`;
                    
                    if (value.includes('equipped'))
                    {
                        const cleanValue = value.split('equipped')[0].trim();
                        return `|${correctedParam} = ${this.itemNames[cleanValue]} equipado.png`;
                    }
    
                    if (value.includes('.png') || value.includes('.gif'))
                    {
                        const [itemName, fileExt] = value.split('.');
                        const translatedName = this.itemNames[itemName.trim()];

                        if (translatedName)
                            return `|${correctedParam} = ${translatedName}.${fileExt}`;

                        return `|${correctedParam} = &${value}`;
                    }
    
                    // Mostly for {{Infobox Recipe}} with all its |mat(s) and |output(s).
                    const itemName = this.itemNames[value];
                    if (itemName !== undefined)
                        return `|${correctedParam} = ${itemName}`; 
    
                    return false;
                })();
    
                if (translatedParamValue)
                {
                    this.debugger.logSuccess('Param value', index, name, correctedValue);
                    return translatedParamValue;
                }
    
                if (!value)
                {
                    this.debugger.logSkipped('Blank param value', index, name);
                    return `|${correctedParam} = `;
                }
                
                this.debugger.logSkippedParam('Param value translation', name, value);
                return `|${correctedParam} = &${value}`;
            }));
    
            if (singleLineTemplate)
                return `§{{${templateData.templateName}${translatedInput.join('')}}}`;

            return [
                `§{{${templateData.templateName}`, 
                ...translatedInput, 
                '}}'
            ];
        }))
        .then(
            value => value.flat().filter(
                line => line !== undefined
            )
        );
    }
}