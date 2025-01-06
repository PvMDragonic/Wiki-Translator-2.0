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
    const templateName = text.split('|')[0].trim();
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

export async function translate(textToTranslate: string)
{
    const templatesInfo = (await requestWikiTemplates()) as IWikiTemplates;
    const itemsNames = await requestWikiItemNames();

    // Starts split by newline double bracket and ends with 
    // double bracket newline not followed by a pipe.
    return textToTranslate.split(/\n{{|}}\n(?!\|)/).map((text, index) => 
    {
        if (index % 2 === 0) 
            return text.split('\n');

        // Extracts data from {{Infobox Bonuses|param = value|param2 = value2|etc...}}
        const { templateName, templateEntries } = extractInputData(text);

        const templateData = templatesInfo[templateName];
        
        //console.log(templateName, templateEntries, templateData)

        const translatedInput = templateEntries.map(entry =>
        {
            const name = entry.paramName;
            const value = entry.paramValue;

            const translatedParam = templateData.templateParams[name];
            const correctedParam = translatedParam ? translatedParam : name; 
        
            const paramValues = templateData.templateValues[name];
            const correctedValue = paramValues?.[value.toLowerCase()] || value;

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
    }).flat();
}