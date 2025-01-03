import { useRef, useState } from "react";
import { SideMenu } from "../SideMenu";
import HelpIcon from "../../assets/HelpIcon";

/**
 * Renders the help button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionHelp(): JSX.Element
{
    const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const buttonClass = `options-bar__button options-bar__button--${showSideMenu ? 'active' : 'inactive'}`;

    return (
        <>
            <SideMenu
                buttonRef = {buttonRef}
                showSideMenu = {showSideMenu}
                setShowSideMenu = {setShowSideMenu}
            >
                {<></>}
            </SideMenu>

            <a 
                href = "https://github.com/PvMDragonic/Wiki-Translator-2.0/blob/main/README.md" 
                target = "_blank"
                style = {{ textDecoration: 'none' }}
            >        
                <button 
                    ref = {buttonRef}
                    className = {buttonClass}
                    onClick = {() => setShowSideMenu(prev => !prev)}
                >
                    <HelpIcon/>
                    <span>AJUDA</span>
                </button>
            </a>
        </>
    )
}