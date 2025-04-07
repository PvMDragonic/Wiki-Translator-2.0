import { useEffect, useContext } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";
import SettingsContext from "@pages/Home/settingsContext";

export function useSettings() 
{
    const 
    {
        // Hyperlink options.
        hyperlinks, setHyperlinks,
        splitData, setSplitData,
        rswData, setRswData,

        // Text foramtting options.
        removeBody, setRemoveBody,
        equalsSpacing, setEqualsSpacing,
        untranslated, setUntranslated,
        diffExamine, setDiffExamine,
        diffNavboxes, setDiffNavboxes,
        diffCategories, setDiffCategories,
        aggressive, setAggressive,

        // Developer options.
        retranslate, setRetranslate,
        debugging, setDebugging,
        debugSplitted, setDebugSplitted,
        debugTemplate, setDebugTemplate,
        debugSuccess, setDebugSuccess,
        debugSkipped, setDebugSkipped,
        debugMissing, setDebugMissing
    } = useContext(SettingsContext);

    const { loadFromStorage } = useLocalStorage();
  
    useEffect(() => 
    {
        const settings = 
        [
            { key: "wikiTranslatorHyperlinks", setter: setHyperlinks, defaultValue: true },
            { key: "wikiTranslatorSplitData", setter: setSplitData, defaultValue: false },
            { key: "wikiTranslatorRSWData", setter: setRswData, defaultValue: false },
            { key: "wikiTranslatorRemoveBody", setter: setAggressive, defaultValue: false },
            { key: "wikiTranslatorEqualsSpacing", setter: setEqualsSpacing, defaultValue: true },
            { key: "wikiTranslatorUntranslated", setter: setUntranslated, defaultValue: true },
            { key: "wikiTranslatorDiffExamine", setter: setDiffExamine, defaultValue: true },
            { key: "wikiTranslatorDiffNavboxes", setter: setDiffNavboxes, defaultValue: true },
            { key: "wikiTranslatorDiffCategories", setter: setDiffCategories, defaultValue: true },
            { key: "wikiTranslatorAggressive", setter: setAggressive, defaultValue: false },
            { key: "wikiTranslatorRetranslate", setter: setRetranslate, defaultValue: false },
            { key: "wikiTranslatorDebugger", setter: setDebugging, defaultValue: false },
            { key: "wikiTranslatorDebugSplitted", setter: setDebugSplitted, defaultValue: false },
            { key: "wikiTranslatorDebugTemplate", setter: setDebugTemplate, defaultValue: false },
            { key: "wikiTranslatorDebugSuccess", setter: setDebugSuccess, defaultValue: false },
            { key: "wikiTranslatorDebugSkipped", setter: setDebugSkipped, defaultValue: false },
            { key: "wikiTranslatorDebugMissing", setter: setDebugMissing, defaultValue: false }
        ];
  
        settings.forEach(
            ({ key, setter, defaultValue }) => setter(loadFromStorage(key, defaultValue))
        );
    }, [
        setHyperlinks, setSplitData, setRswData, 
        setRemoveBody, setEqualsSpacing, setUntranslated, 
        setDiffExamine, setDiffNavboxes, setDiffCategories,
        setAggressive, setRetranslate, setDebugging, 
        setDebugSplitted, setDebugTemplate, setDebugSuccess, 
        setDebugSkipped, setDebugMissing, loadFromStorage
    ]);
  
    return {
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
    };
}
