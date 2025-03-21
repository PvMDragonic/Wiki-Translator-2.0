export interface IWikiTemplates
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

export interface IWikiItems 
{
    [key: string]: string;
}

export class Wiki
{
    static API = "https://pt.runescape.wiki/api.php";

    static URL = new URLSearchParams({
        prop: "revisions",
        rvprop: "content",
        action: "query",
        format: "json"
    });

    static async requestItemExamine(itemName: string): Promise<string>
    {
        const params = new URLSearchParams(Wiki.URL);
        params.set('titles', `Módulo:Mercado/${itemName.replace(/ /g, '_')}`);

        return fetch(`${Wiki.API}?${params}`)
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
                const content = page.revisions[0]['*'];

                if (content && content.startsWith('return'))
                {
                    const clean = content
                        .replace('return ', '')
                        // Replaces `=` with `:` for key-value pairs.
                        .replace(/(\w+)\s*=/g, '"$1":') 
                        // Encloses all string values in double quotes.
                        .replace(/:\s*([a-zA-Z\u00C0-\u00FF][\w\s\(\)áéíóúãõç]*)/g, ': "$1"')
                        // Removes trailing commas before closing brace.
                        .replace(/,(\s*})/g, '$1');

                    return JSON.parse(clean).examine;
                }

                return undefined;
            })
            .catch((_) => 
            {
                return undefined;
            });
    }

    static async requestTemplates(): Promise<IWikiTemplates>
    {
        const params = new URLSearchParams(Wiki.URL);
        params.set('titles', 'Usuário:PvM Dragonic/WikiTranslator.json');

        return fetch(`${Wiki.API}?${params}`)
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
                return JSON.parse(page.revisions[0]['*']) as IWikiTemplates;
            })
            .catch(error => 
            {
                throw new Error(`Something went wrong: ${error}`);
            });
    }
    
    static async requestItemNames(): Promise<IWikiItems>
    {
        const pages = ["data", "data/2", "data/3"];
        const items: IWikiItems = {};
    
        for (const page of pages)
        {
            const params = new URLSearchParams(Wiki.URL);
            params.set('titles', `Módulo:Traduções/${page}`);

            await fetch(`${Wiki.API}?${params}`)
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
}
