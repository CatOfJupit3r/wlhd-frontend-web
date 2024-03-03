export interface translationOutput {
    mainCmd: string;
    parsedArgs: {
        [key: string]: string | translationOutput;
    }
}