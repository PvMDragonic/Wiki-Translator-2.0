import { useState } from "react";
import { TextInput } from "../../components/TextInput";
import { TextOutput } from "../../components/TextOutput";

export function Home()
{
    // Needs to be a string[] due to how <div contentEditable> handles newlines.
    const [translation, setTranslation] = useState<string[]>(['']);

    return (
        <div className = "home">
            <section className = "home__translator">
                <TextInput
                    translation = {translation}
                    setTranslation = {setTranslation}
                />
                <TextOutput
                    translation = {translation}
                />
            </section>
        </div>
    )
}