interface IWikiTemplates
{
    [key: string]: 
    {
        templateName: string,
        templateParams: 
        { 
            [key: string]: string; 
        },
        templateValues: 
        { 
            [key: string]: 
            { 
                [key: string]: string; 
            } 
        }
    }
}

async function requestWikiTemplates()
{
    const apiUrl = "https://pt.runescape.wiki/api.php";
    const params = new URLSearchParams({
        titles: "Usuário:PvM Dragonic/WikiTranslator.json",
        prop: "revisions",
        rvprop: "content",
        action: "query",
        format: "json"
    });

    return fetch(`${apiUrl}?${params}`)
        .then(response => 
        {
            if (!response.ok) 
                throw new Error(`HTTP error! Status: ${response.status}`);

            return response.json();
        })
        .then(data => 
        {
            const queryPages = data.query.pages;
            const page = queryPages[Object.keys(queryPages)[0]];
            return JSON.parse(page.revisions[0]['*']);
        })
        .catch(error => 
        {
            console.error("Error fetching the module:", error);
        });
}

async function requestWikiItemNames()
{
    const apiUrl = "https://pt.runescape.wiki/api.php";
    const pages = ["data", "data/2", "data/3"];
    const items: Record<string, string> = {};

    for (const page of pages)
    {
        const params = new URLSearchParams({
            titles: `Módulo:Traduções/${page}`,
            prop: "revisions",
            rvprop: "content",
            action: "query",
            format: "json"
        });
    
        await fetch(`${apiUrl}?${params}`)
            .then(response => 
            {
                if (!response.ok) 
                    throw new Error(`HTTP error! Status: ${response.status}`);
    
                return response.json();
            })
            .then(data => 
            {
                const queryPages = data.query.pages;
                const pageData = queryPages[Object.keys(queryPages)[0]];
                const content = pageData.revisions[0]['*'];
                
                content.split('] = {').slice(1).map((entry: string) => 
                {
                    const [_, en, pt] = entry.split('=');

                    try
                    {
                        const key = en.match(/'(.*?[^\\])'/)![1]; // Handles "Nulodion's Notes". 
                        const value = pt.split('\'')[1];
                        items[key] = value;
                    }
                    catch(e)
                    {
                        // Some titles and stuff that contain HTML tags for coloring
                        // are included in this, and they'll cause errors. Since the
                        // main objetive is to translate items, may aswell ignore
                        // titles and other edge cases for now.
                    }
                    
                    
                });
            })
            .catch(error => 
            {
                console.error("Error fetching the module:", error);
            });
    }

    return items;
}

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

function handleUnconventional(text: string, itemsNames: Record<string, string>, templateName: string)
{
    // Categories will fall here.
    if (text.startsWith('[['))
        return text.split('\n');
    
    // Navboxes will fall here.
    if (!text.includes('|') && text !== '')
        return [`{{${text}}}`]

    const translatedParamName = itemsNames[text.split('|')[1]];

    if (translatedParamName)
        return [`{{${templateName}|${translatedParamName}}}`];

    return text.split('\n');
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

export async function translate(textToTranslate: string)
{
    const templatesInfo = (await requestWikiTemplates()) as IWikiTemplates;
    const itemsNames = await requestWikiItemNames();

    // Removes trailing newlines, then splits by newline double bracket ending with double bracket newline not followed by a pipe.
    const splitted = textToTranslate.replace(/\n+$/, '').split(/\n{{|}}\n(?!\|)/);

    return splitted.map((text, index) => 
    {
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
            return leftoverText.length === 1 && leftoverText[0].length <= 2 ? [null] : leftoverText;
        }

        // 'splitted' will have only one element when a single, clean template is inputted.
        // This is also why trailing newlines need to be removed, to properly detect a single template.
        if (index % 2 === 0 && splitted.length > 1) 
            return text.split('\n');

        // Extracts data from {{Infobox Bonuses|param = value|param2 = value2|etc...}}
        const { templateName, templateEntries } = extractInputData(text);
        
        const templateData = templatesInfo[templateName];

        // Unconventional templates like {{Uses material list}} don't have a set of key:value params.
        if (templateEntries.length === 0)
        {
            // Some junk gets here when a whole article is thrown at the translator.
            if (text.startsWith('\n') || text.startsWith(''))
                return text.split('\n');

            const _templateName = templateData ? templateData.templateName : templateName;
            return handleUnconventional(text, itemsNames, _templateName);
        }

        const translatedInput = templateEntries.map(entry =>
        {
            const name = entry.paramName;
            const value = entry.paramValue;

            const translatedParam = templateData.templateParams[name];
            const correctedParam = translatedParam ? translatedParam : name; 
        
            // Templates with untranslatable values (numbers), like {{Disassembly}}, may not have 'templateValues'.
            const correctedValue = templateData.templateValues?.[name]?.[value.toLowerCase()] || value;

            // Brute force translation since hash tables are O(1).
            if (correctedValue === value)
            {
                if (value.includes('equipped'))
                {
                    const cleanValue = value.split('equipped')[0].trim();
                    return `|${correctedParam} = ${itemsNames[cleanValue]} equipado.png`;
                }

                if (value.includes('.png') || value.includes('.gif'))
                {
                    const cleanValue = value.split('.');
                    return `|${correctedParam} = ${itemsNames[cleanValue[0].trim()]}.${cleanValue[1]}`;
                }

                // Mostly for {{Infobox Recipe}} with all its |mat(s) and |output(s).
                const itemName = itemsNames[value];
                if (itemName !== undefined)
                    return `|${correctedParam} = ${itemName}`;
            }        
            
            return `|${correctedParam} = ${correctedValue}`;
        });

        return [
            `{{${templateData.templateName}`, 
            ...translatedInput, 
            '}}'
        ];
    }).flat().filter(line => line !== null);
}