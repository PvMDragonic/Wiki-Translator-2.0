import { useEffect, useState } from "react";
import { TextInput } from "../../components/TextInput";
import { TextOutput } from "../../components/TextOutput";
import { OptionsBar } from "../../components/OptionsBar";

export function Home()
{
    // Needs to be a string[] due to how <div contentEditable> handles newlines.
    const [translation, setTranslation] = useState<string[]>(['']);
    const [textExists, setTextExists] = useState<boolean>(false);

    useEffect(() => 
    {
        setTextExists(!(translation[0] === '' && translation.length === 1));
    }, [translation]);

    return (
        <div className = "home">
            <section className = "home__container">
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
            </section>
        </div>
    )
}