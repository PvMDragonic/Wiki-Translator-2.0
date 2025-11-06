export interface IDebugger
{
    debugging: boolean,
    debugSplitted: boolean,
    debugTemplate: boolean, 
    debugSuccess: boolean,
    debugSkipped: boolean, 
    debugMissing: boolean
}

interface ITemplateEntry 
{
    paramName: string;
    paramValue: string;
}

interface ITemplateData 
{
    templateName: string;
    templateParams: Record<string, string>;
    templateValues: Record<string, Record<string, string>>;
}

export class Debugger implements IDebugger
{
    constructor(
        public debugging: boolean,
        public debugSplitted: boolean,
        public debugTemplate: boolean, 
        public debugSuccess: boolean,
        public debugSkipped: boolean, 
        public debugMissing: boolean
    ) {}

    logSplitted(splitted: string[])
    {
        if (!this.debugging || !this.debugSplitted) return;

        console.log(
            'splitted array:\n\t', 
            splitted
        );
    }

    logTemplate(index: number, templateName: string, templateEntries: ITemplateEntry[], templateData: ITemplateData)
    {
        if (!this.debugging || !this.debugTemplate) return;

        console.log(
            'Template found:',
            '\n\t\'splitted\' index: ', 
            index, 
            '\n\ttemplateName: ', 
            templateName, 
            '\n\ttemplateEntries: ', 
            templateEntries, 
            '\n\ttemplateData: ', 
            templateData
        );
    }

    logSuccess(name: string, index: number, text: string, translated?: string)
    {
        if (!this.debugging || !this.debugSuccess) return;

        console.log(
            `${name} successfully translated:`,
            '\n\t\'splitted\' index: ',
            index,
            translated ? '\n\tparamName:' : '\n\ttext: ', 
            text,
            translated ? `\n\tparamValue: ${translated}` : ''
        )
    }

    logSkipped(name: string, index: number, text: string)
    {
        if (!this.debugging || !this.debugSkipped) return;

        console.log(
            `${name} skipped:`,
            '\n\t\'splitted\' index: ',
            index,
            '\n\ttext: ', 
            text
        );
    }

    logSkippedParam(reason: string, name: string, value: string)
    {
        if (!this.debugging || !this.debugSkipped) return;

        console.log(
            `${reason} skipped:`,
            '\n\tparamName: ',
            name,
            '\n\tparamValue: ',
            value
        );
    }

    logMissing(name: string, index: number, text: string)
    {
        if (!this.debugging || !this.debugMissing) return;

        console.log(
            `${name} missing: `, 
            '\n\t\'splitted\' index: ', 
            index,
            '\n\ttext: ',
            text
        );
    }

    logMissingParam(index: number, templateName: string, name: string, value: string)
    {
        if (!this.debugging || !this.debugMissing) return;

        console.log(
            'Wiki .json missing param: ', 
            '\n\t\'splitted\' index: ', 
            index,
            '\n\ttemplateName: ',
            templateName,
            '\n\tparamName: ',
            name,
            '\n\tparamValue: ',
            value
        );
    }

    logMissingName(index: number, templateName: string, name: string)
    {
        if (!this.debugging || !this.debugMissing) return;

        console.log(
            'Template param missing name translation', 
            '\n\t\'splitted\' index: ', 
            index,
            '\n\ttemplateName: ',
            templateName,
            '\n\tparamName: ',
            name
        );
    }
}