import { createContext } from "react";

interface UserContextType 
{
    // Text options.
    hyperlinks: boolean;
    setHyperlinks: React.Dispatch<React.SetStateAction<boolean>>;
    splitData: boolean;
    setSplitData: React.Dispatch<React.SetStateAction<boolean>>;
    untranslated: boolean;
    setUntranslated: React.Dispatch<React.SetStateAction<boolean>>;
    diffExamine: boolean;
    setDiffExamine: React.Dispatch<React.SetStateAction<boolean>>;
    aggressive: boolean;
    setAggressive: React.Dispatch<React.SetStateAction<boolean>>;

    // Developer options.
    retranslate: boolean;
    setRetranslate: React.Dispatch<React.SetStateAction<boolean>>;
    debugging: boolean;
    setDebugging: React.Dispatch<React.SetStateAction<boolean>>;
    debugSplitted: boolean;
    setDebugSplitted: React.Dispatch<React.SetStateAction<boolean>>;
    debugTemplate: boolean;
    setDebugTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    debugSuccess: boolean;
    setDebugSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    debugSkipped: boolean;
    setDebugSkipped: React.Dispatch<React.SetStateAction<boolean>>;
    debugMissing: boolean;
    setDebugMissing: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContext = createContext<UserContextType>(
    {} as UserContextType
);

export default SettingsContext;