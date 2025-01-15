import { useEffect, useState } from "react";
import { TextInput } from "../../components/TextInput";
import { TextOutput } from "../../components/TextOutput";
import { OptionsBar } from "../../components/OptionsBar";
import SettingsContext from "./settingsContext";

export function Home()
{
    // Needs to be a string[] due to how <div contentEditable> handles newlines.
    const [translation, setTranslation] = useState<string[]>(['']);
    const [textExists, setTextExists] = useState<boolean>(false);

    const [retranslate, setRetranslate] = useState<boolean>(false);
    
    useEffect(() => 
    {
        setTextExists(!(translation[0] === '' && translation.length === 1));
    }, [translation]);

    return (
        <div className = "home">
            <section className = "home__container">
                <SettingsContext.Provider 
                    value = {{ 
                        retranslate, setRetranslate 
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