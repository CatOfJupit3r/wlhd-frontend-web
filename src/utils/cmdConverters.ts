import {translationOutput} from "../types/Translation";

export const cmdToTranslation = (cmd: string): string => {
    try {
        const [dlc, descriptor] = cmd.split("::")
        if (descriptor === undefined) {
            throw new Error(`CMD could not be split into dlc and descriptor: ${cmd}`)
        }
        return `${dlc}:${descriptor.replace(":", ".")}`
    }
    catch (e: any) {
        console.error(e)
        return cmd
    }
}


export const cmdToFormatted = (cmd: string, args: Array<string | number | Array<string>>): translationOutput => {
    const parsedArgs: {
        [key: string]: string | translationOutput;
    } = {}
    try {
        for (let [index, arg] of args.entries()) {
            const argKey = `{${index}}`
            if (Array.isArray(arg)) {
                if (arg.length === 1) {
                    parsedArgs[argKey] = {
                        mainCmd: cmdToTranslation(arg[0]),
                        parsedArgs: {}
                    }
                } else {
                    parsedArgs[argKey] = cmdToFormatted(arg[0], arg.slice(1))
                }
            } else if (typeof arg === "number") {
                parsedArgs[argKey] = arg.toString()
            } else {
                parsedArgs[argKey] = arg
            }
        }
        return {
            mainCmd: cmdToTranslation(cmd),
            parsedArgs
        }
    }
    catch (e: any) {
        console.error(e)
        return {
            mainCmd: cmdToTranslation(cmd),
            parsedArgs
        }
    }
}