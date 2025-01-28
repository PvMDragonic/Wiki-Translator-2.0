import { useEffect, useContext } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";
import SettingsContext from "@pages/Home/settingsContext";

export function useSettings() 
{
    const 
    {
        // Text options.
        hyperlinks, setHyperlinks,

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
        setHyperlinks, setRetranslate, setDebugging, 
        setDebugSplitted, setDebugTemplate, setDebugSuccess, 
        setDebugSkipped, setDebugMissing, loadFromStorage
    ]);
  
    return {
        hyperlinks, setHyperlinks,
        retranslate, setRetranslate,
        debugging, setDebugging,
        debugSplitted, setDebugSplitted,
        debugTemplate, setDebugTemplate,
        debugSuccess, setDebugSuccess,
        debugSkipped, setDebugSkipped,
        debugMissing, setDebugMissing
    };
}
