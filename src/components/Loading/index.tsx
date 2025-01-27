import LoadingIcon from "@assets/LoadingIcon";

export function Loading()
{
    return (
        <section className = "loading">
            <h1 className = "loading__text">
                Carregando...
            </h1>
            <LoadingIcon/>
        </section> 
    )
}