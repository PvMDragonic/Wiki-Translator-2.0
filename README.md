_**Para a versão em Português, [clique aqui](README-PTBR.md).**_

# Wiki Translator 2.0

## Overview
The Wiki Translator 2.0 is a browser application designed to assist users in translating pages from the [English RuneScape 3 Wiki](https://runescape.wiki/) to the [Brazillian-Portuguese RuneScape 3 Wiki](https://pt.runescape.wiki/). 

## Story
The PT-BR Wiki has always been behind the main RSW due to staff shortage. Because of this, users always sought after ways of speeding up the process of adapting pages from one to the other. 

Because of this, [GlouphrieTranslator](https://github.com/Toktom/GlouphrieTranslator) was created in 2022 as an attempt to help automate this. The problem was that GT was a Python library, so not only did it require users to understand how to code, they also needed to implement their own solutions using the translating library. So, in 2023, the [Wiki Translator 1.0](https://github.com/LucianoDLima/WikiDropTable) was created in an attempt to give end-users a ready-to-use tool, but because of the way it handled translation, adding support to more templates became problematic. There was a fatal understimation of inconsistencies in the naming of params and values on the PT-BR side, that clashed with the idea of using a generic dictionary for translation. In an attempt to fix this, many exceptions in the code were made that turned it into spaghetti, and not only that, but updating the translator data required a git push, which made it impossible for the average wiki user to update it.

As such, it was decided to have the project recreated from scratch. This time, using React (instead of vanilla JS) with translations being handled per-template (which solves the inconsistency issue). Also, to facilitate maintanance, all of its data gets stored and/or pulled straight from the wiki, allowing regular users to contribute to it.

## How it works
Translation is made via simple key:value matching in an object.

The translator requires template data that gets pulled from [here](https://pt.runescape.wiki/w/Usu%C3%A1rio:PvM_Dragonic/WikiTranslator.json) via the [RSW API](https://runescape.wiki/w/Help:APIs), in the following format:

```
{
    "Infobox Item": 
    {
        "templateName": "Infobox objeto",
        "templateParams": 
        {
            "version": "versão",
            "name": "nome",
            "image": "imagem",
            "release": "lançamento",
            "update": "atualização",
            "examine": "examinar",
            "members": "membros",
            "quest": "missão",
            "weight": "peso",
            ...
        },
        "templateValues": 
        {
            "members": 
            {
                "yes": "Sim",
                "no": "Não"
            },
            "exchange": 
            {
                "gemw": "gemw",
                "no": "Não"
            },
            "destroy": 
            {
                "drop": "Largar"
            },
            ...
        }
    },
    ...
}
```

It also requires item naming data from the following sources:
- [data](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data);
- [data/2](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data/2);
- [data/3](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data/3)

### Example
This is a before (from the RSW, in English) and after (to the PT-BR, in Portuguese):
```
{{Infobox Recipe
|members = Yes
|ticks = 
|ticksnote = 
|skill1 = Fletching
|skill1lvl = 110
|skill1boostable = Yes
|skill1exp = 10
|misc1 = You must complete the achievement: [[Fletch Quest]]
|mat1 = Masterwork bow (untillered)
|mat1cost = calcvalue
|output1 = Masterwork bow
}}
```

```
{{Infobox criar
|membros = Sim
|ticks =
|ticksnota =
|hab1 = Fletching
|hab1nível = 110
|hab1impulso = Sim
|hab1exp = 10
|misc1 = You must complete the achievement: [[Fletch Quest]]
|mat1 = Masterwork bow (untillered)
|mat1preço = calcvalue
|produto1 = Arco Magistral
}}
```

### Dependencies
The Wiki Translator 2.0 was build using the following technologies:
- **[TypeScript](https://www.typescriptlang.org/)**;
- **[React](https://reactjs.org/)**;
- **[SASS](https://sass-lang.com/)**;
- **[Vite](https://vite.dev/)**