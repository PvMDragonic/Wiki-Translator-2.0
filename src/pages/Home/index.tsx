import { useEffect, useState } from "react";
import SettingsContext from "./settingsContext";
import { OptionsBar } from "@components/OptionsBar";
import { TextInput } from "@components/TextInput";
import { TextOutput } from "@components/TextOutput";

export function Home()
{
    // Needs to be a string[] due to how <div contentEditable> handles newlines.
    const [translation, setTranslation] = useState<string[]>(['']);
    const [textExists, setTextExists] = useState<boolean>(false);

    const [retranslate, setRetranslate] = useState<boolean>(false);
    const [debugging, setDebugging] = useState<boolean>(false);
    const [debugSplitted, setDebugSplitted] = useState<boolean>(false);
    const [debugTemplate, setDebugTemplate] = useState<boolean>(false);
    const [debugSuccess, setDebugSuccess] = useState<boolean>(false);
    const [debugSkipped, setDebugSkipped] = useState<boolean>(false);
    const [debugMissing, setDebugMissing] = useState<boolean>(false);
    
    useEffect(() => 
    {
        setTextExists(!(translation[0] === '' && translation.length === 1));
    }, [translation]);

    return (
        <div className = "home">
            <section className = "home__container">
                <SettingsContext.Provider 
                    value = {{ 
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
                Feito por <a 
                    target = "_blank" 
                    href = "https://github.com/LucianoDLima"
                >Queen Guava</a> & <a 
                    target = "_blank" 
                    href = "https://github.com/PvMDragonic"
                >PvM Dragonic</a>.
            </p>
        </div>
    )
}