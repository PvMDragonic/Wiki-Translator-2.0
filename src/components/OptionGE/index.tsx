import { useRef, useState } from "react";
import { SideMenu } from "../SideMenu";
import GrandExchangeIcon from "../../assets/GrandExchangeIcon";

/**
 * Renders the Grand Exchange button on the options bar.
 *
 * @component
 * @returns {JSX.Element} The rendered button.
 */
export function OptionGE(): JSX.Element
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

            <button 
                ref = {buttonRef}
                className = {buttonClass}
                onClick = {() => setShowSideMenu(prev => !prev)}
            >
                <GrandExchangeIcon/>
                <span>M.G.</span>
            </button>
        </>
    )
}