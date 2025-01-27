import { ComponentPropsWithoutRef } from "react";

function LoadingIcon({ ...props }: ComponentPropsWithoutRef<"svg">) 
{

    const loadingStyles = 
    {
        Base: 
        {
            animation: "loadingIcon 1.05s infinite"
        },
        Delay1: 
        {
            animationDelay: "0.1s"
        },
        Delay2: 
        {
            animationDelay: "0.2s"
        }

    };

    return (
        <svg
            viewBox = "0 0 24 24"
            xmlns = "http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx = "4"
                cy = "12"
                r = "3"
                style = {loadingStyles.Base}
            />
            <circle
                cx = "12"
                cy = "12"
                r = "3"
                style = {{ 
                    ...loadingStyles.Base, 
                    ...loadingStyles.Delay1 
                }}
            />
            <circle
                cx = "20"
                cy = "12"
                r = "3"
                style = {{ 
                    ...loadingStyles.Base, 
                    ...loadingStyles.Delay2 
                }}
            />
        </svg>
    );
}

export default LoadingIcon;
