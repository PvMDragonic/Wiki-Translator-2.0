_**For the English version, [click here](README.md).**_

# Wiki Translator 2.0

## Visão Geral
The Wiki Translator 2.0 is a browser application designed to assist users in translating pages from the [English RuneScape 3 Wiki](https://runescape.wiki/) to the [Brazillian-Portuguese RuneScape 3 Wiki](https://pt.runescape.wiki/). 

## História
A Wiki PT-BR sempre esteve atrás da RSW principal devido à falta de pessoal. Por conta disso, os usuários sempre buscaram maneiras de acelerar o processo de adaptar as páginas de uma para a outra.

Para resolver esse problema, o [GlouphrieTranslator](https://github.com/Toktom/GlouphrieTranslator) foi criado em 2022 como uma tentativa de automatizar o processo de tradução. O problema é que o GT se tratava de uma biblioteca Python, então os usuários  precisavam de ter não apenas conhecimentos de programação, como também implementar suas próprias soluções utilizando a biblioteca. Assim, em 2023, o [Wiki Translator 1.0](https://github.com/LucianoDLima/WikiDropTable) foi desenvolvido para simplificar o processo para os usuários finais com uma ferramenta pronta para uso, porém, devido a forma como as traduções eram tratadas, adicionar suporte para mais predefinições se tornou problemático. Houve uma grande subestimação das inconsistências nas nomenclaturas de parâmetros e valores no lado da PT-BR, coisa que bateu de frente com a ideia de utilizar um dicionário genérico para as traduções. Isso fez com que muitas exceções fossem acrescentadas no código, levando a uma estrutura confusa e desorganizada, sem contar que a atualização dos dados de tradução exigia um git push, o que tornava imprático para o usuário médio da wiki contribuir.

Por conta disso tudo, foi decidido recriar o projeto do zero. Desta vez, utilizando React (em vez de JavaScript puro) e tratando as traduções individualmente (resolvendo o problema das inconsistências). Ainda, para facilitar a manutenção, todos os dados são armazenados e extraídos diretamente da wiki, permitindo que usuários comuns contribuam atualizando-a.

## Como funciona
A tradução é feita batendo chave com valores em um objeto.

O tradutor requer dados das predefinições que podem ser puxados [daqui](https://pt.runescape.wiki/w/Usu%C3%A1rio:PvM_Dragonic/WikiTranslator.json) usando a [RSW API](https://runescape.wiki/w/Help:APIs), no seguinte formato:

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

Ele também requer dados sobre a nomenclatura de itens das seguintes fontes:
- [data](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data);
- [data/2](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data/2);
- [data/3](https://pt.runescape.wiki/w/M%C3%B3dulo:Tradu%C3%A7%C3%B5es/data/3)

### Exemplo
Este é o antes (da RSW, em Inglês) e o depois (para a PT-BR, em Português):
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

### Dependências
O Wiki Translator 2.0 foi feito utilizando as seguintes tecnologias:
- **[TypeScript](https://www.typescriptlang.org/)**;
- **[React](https://reactjs.org/)**;
- **[SASS](https://sass-lang.com/)**;
- **[Vite](https://vite.dev/)**