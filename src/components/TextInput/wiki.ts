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

export class Wiki
{
    static API = "https://pt.runescape.wiki/api.php";

    static async requestTemplates(): Promise<IWikiTemplates>
    {
        const params = new URLSearchParams({
            titles: "Usuário:PvM Dragonic/WikiTranslator.json",
            prop: "revisions",
            rvprop: "content",
            action: "query",
            format: "json"
        });
    
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
    
    static async requestItemNames()
    {
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
