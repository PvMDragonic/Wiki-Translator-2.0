import { createContext } from "react";

interface UserContextType 
{
    retranslate: boolean;
    setRetranslate: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContext = createContext<UserContextType>(
    {} as UserContextType
);

export default SettingsContext;