import { useEffect, useContext } from "react";
import SettingsContext from "../../pages/Home/settingsContext";

export function useDebugger() 
{
    const 
    {
        retranslate,
        setRetranslate,
        debugging,
        setDebugging,
        debugSplitted,
        setDebugSplitted,
        debugTemplate,
        setDebugTemplate,
        debugSuccess,
        setDebugSuccess,
        debugSkipped,
        setDebugSkipped,
        debugMissing,
        setDebugMissing,
    } = useContext(SettingsContext);
  
    useEffect(() => 
    {
        const settings = 
        [
            { key: "wikiTranslatorRetranslate", setter: setRetranslate },
            { key: "wikiTranslatorDebugger", setter: setDebugging },
            { key: "wikiTranslatorDebugSplitted", setter: setDebugSplitted },
            { key: "wikiTranslatorDebugTemplate", setter: setDebugTemplate },
            { key: "wikiTranslatorDebugSuccess", setter: setDebugSuccess },
            { key: "wikiTranslatorDebugSkipped", setter: setDebugSkipped },
            { key: "wikiTranslatorDebugMissing", setter: setDebugMissing },
        ];
  
        settings.forEach(({ key, setter }) => 
        {
            const value = localStorage.getItem(key);
            if (value !== null) 
                setter(JSON.parse(value));
        });
    }, [setRetranslate, setDebugging, setDebugSplitted, setDebugTemplate, setDebugSuccess, setDebugSkipped, setDebugMissing]);
  
    return {
        retranslate,
        setRetranslate,
        debugging,
        setDebugging,
        debugSplitted,
        setDebugSplitted,
        debugTemplate,
        setDebugTemplate,
        debugSuccess,
        setDebugSuccess,
        debugSkipped,
        setDebugSkipped,
        debugMissing,
        setDebugMissing,
    };
}
