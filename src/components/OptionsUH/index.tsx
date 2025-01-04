import { useRef, useState } from "react";
import { SideMenu } from "../SideMenu";
import UpdateHistoryIcon from "../../assets/UpdateHistoryIcon";

/**
 * Renders the update history button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionHU(): JSX.Element
{
    const [showSideMenu, setShowSideMenu] = useState<string>('');
    const buttonRef = useRef<HTMLButtonElement>(null);

    const buttonClass = `options-bar__button options-bar__button--${
        showSideMenu === 'show' ? 'active' : 'inactive'
    }`;

    return ( 
        <>
            <SideMenu
                buttonRef = {buttonRef}
                showSideMenu = {showSideMenu}
                setShowSideMenu = {setShowSideMenu}
            >
                {<></>}
            </SideMenu>

            <button 
                ref = {buttonRef}
                className = {buttonClass}
                onClick = {() => setShowSideMenu(prev => prev === 'show' ? 'hide' : 'show')}
            >
                <UpdateHistoryIcon/>
                <span>H.A.</span>
            </button>
        </>     
    )
}