import { useTranslation } from "react-i18next";
import LoadingIcon from "@assets/LoadingIcon";

export function Loading()
{
    const { t } = useTranslation();

    return (
        <section className = "loading">
            <h1 className = "loading__text">
                {t('Loading')}
            </h1>
            <LoadingIcon/>
        </section> 
    )
}