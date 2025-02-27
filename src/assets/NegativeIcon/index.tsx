import { ComponentPropsWithoutRef } from "react";

function NegativeIcon({ ...props }: ComponentPropsWithoutRef<"svg">)
{
    return (
        <svg 
            viewBox = "178.8827 281.7898 12.0002 12.0019" 
            xmlns = "http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d = "M 179.029 282.645 C 178.758 282.372 178.881 281.907 179.254 281.807 C 179.426 281.761 179.612 281.81 179.737 281.937 L 184.871 286.117 L 190.028 281.937 C 190.301 281.664 190.766 281.789 190.866 282.161 C 190.912 282.334 190.863 282.518 190.736 282.645 L 186.577 287.738 L 190.736 292.937 C 191.009 293.209 190.883 293.675 190.511 293.774 C 190.339 293.821 190.155 293.771 190.028 293.645 L 184.849 289.398 L 179.737 293.645 C 179.466 293.917 179 293.793 178.901 293.42 C 178.854 293.247 178.904 293.063 179.029 292.937 L 183.143 287.752 L 179.029 282.645 Z" 
                style = {{
                    fill: 'rgb(255, 65, 65)', 
                    transformOrigin: '184.883px 287.791px'
                }}
            />
        </svg>
    )
}

export default NegativeIcon;