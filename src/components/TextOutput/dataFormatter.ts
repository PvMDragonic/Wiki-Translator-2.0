/**
 * Responsible for handling "[[day month]] [[year]]" formatting into "{{Data|day|month|year}}".
 */
export class DataFormatter
{
    static MONTH_NAMES: Record<string, string> = {
        'january': 'Janeiro',
        'february': 'Fevereiro',
        'march': 'Março',
        'april': 'Abril',
        'may': 'Maio',
        'june': 'Junho',
        'july': 'Julho',
        'august': 'Agosto',
        'september': 'Setembro',
        'october': 'Outubro',
        'november': 'Novembro',
        'december': 'Dezembro'
    };

    /**
     * Returns the number of the month given it's English name.
     */
    static monthNumber(month: string)
    {
        return new Intl.DateTimeFormat(
            'en-US', { month: 'numeric' }
        ).format(
            new Date(`${month} 1, 2000`)
        );
    }

    /**
     * Separates a date found inside a Template into the necessary parts for JSX formatting.
     */
    static cleanInfoboxDate(textLine: string)
    {
        const [paramName, day, month, year] = textLine.slice(1).split(' = ');
        const monthNumber = DataFormatter.monthNumber(month);
        const translatedMonth = DataFormatter.MONTH_NAMES[month.toLowerCase()];

        return {
            paramName, day, monthNumber, translatedMonth, year
        }
    }

    /**
     * Separates a date found inside a {{UL}} into the necessary parts for JSX formatting.
     */
    static cleanULDate(textLine: string)
    {
        const [firstPart, dataPlusRest] = textLine.split('data=');
        const [day, month, year] = dataPlusRest.split(' ');
        const cleanYear = year.slice(0, 4);
        const restFromYear = year.slice(4);
        const monthNumber = DataFormatter.monthNumber(month);
        const translatedMonth = DataFormatter.MONTH_NAMES[month.toLowerCase()];

        return {
            firstPart, day, monthNumber, translatedMonth, cleanYear, restFromYear
        }
    }
}