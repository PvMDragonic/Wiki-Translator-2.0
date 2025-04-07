import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { IWikiItems, IWikiTemplates, Wiki } from "src/api/wiki";
import { OptionsBar } from "@components/OptionsBar";
import { TextInput } from "@components/TextInput";
import { TextOutput } from "@components/TextOutput";
import { Loading } from "@components/Loading";
import SettingsContext from "./settingsContext";

export function Home()
{
    // Needs to be a string[] due to how <div contentEditable> handles newlines.
    const [translation, setTranslation] = useState<string[]>([]);
    const [textExists, setTextExists] = useState<boolean>(false);
    const [templates, setTemplates] = useState<IWikiTemplates | null>(null);
    const [itemNames, setItemNames] = useState<IWikiItems | null>(null);

    const [hyperlinks, setHyperlinks] = useState<boolean>(true);
    const [splitData, setSplitData] = useState<boolean>(false);
    const [rswData, setRswData] = useState<boolean>(false);
    const [removeBody, setRemoveBody] = useState<boolean>(false);
    const [equalsSpacing, setEqualsSpacing] = useState<boolean>(true);
    const [untranslated, setUntranslated] = useState<boolean>(true);
    const [diffExamine, setDiffExamine] = useState<boolean>(true);
    const [diffNavboxes, setDiffNavboxes] = useState<boolean>(true);
    const [diffCategories, setDiffCategories] = useState<boolean>(true);
    const [aggressive, setAggressive] = useState<boolean>(false);
    const [retranslate, setRetranslate] = useState<boolean>(false);
    const [debugging, setDebugging] = useState<boolean>(false);
    const [debugSplitted, setDebugSplitted] = useState<boolean>(false);
    const [debugTemplate, setDebugTemplate] = useState<boolean>(false);
    const [debugSuccess, setDebugSuccess] = useState<boolean>(false);
    const [debugSkipped, setDebugSkipped] = useState<boolean>(false);
    const [debugMissing, setDebugMissing] = useState<boolean>(false);

    useEffect(() => 
    {
        Wiki.requestTemplates().then(data => setTemplates(data));
        Wiki.requestItemNames().then(data => setItemNames(data));
    }, []);

    useEffect(() => 
    {
        setTextExists(translation.length > 0);
    }, [translation]);

    return (
        <>
            {templates === null || itemNames === null ? (
                <Loading/>
            ) : (
                <div className = "home">
                    <section className = "home__container">
                        <SettingsContext.Provider 
                            value = {{ 
                                hyperlinks, setHyperlinks,
                                splitData, setSplitData,
                                rswData, setRswData,
                                removeBody, setRemoveBody,
                                equalsSpacing, setEqualsSpacing,
                                untranslated, setUntranslated,
                                diffExamine, setDiffExamine,
                                diffNavboxes, setDiffNavboxes,
                                diffCategories, setDiffCategories,
                                aggressive, setAggressive,
                                retranslate, setRetranslate, 
                                debugging, setDebugging,
                                debugSplitted, setDebugSplitted,
                                debugTemplate, setDebugTemplate,
                                debugSuccess, setDebugSuccess,
                                debugSkipped, setDebugSkipped,
                                debugMissing, setDebugMissing
                            }}
                        >
                            <OptionsBar/>
                            <div className = "home__translator">
                                <TextInput
                                    textExists = {textExists}
                                    templates = {templates!}
                                    itemNames = {itemNames!}
                                    setTranslation = {setTranslation}
                                />
                                <TextOutput
                                    textExists = {textExists}
                                    translation = {translation}
                                />
                            </div>
                        </SettingsContext.Provider>
                    </section>
                    <p className = "home__credits">
                        <Trans 
                            i18nKey = "Credits" 
                            values = {{ 
                                guava: 'Queen Guava', 
                                dragonic: 'PvM Dragonic' 
                            }}
                            components = {{ 
                                1: <a href='https://github.com/LucianoDLima'/>,
                                2: <a href='https://github.com/PvMDragonic'/>
                            }} 
                        />
                    </p>
                </div>
            )}
        </>
    )
}