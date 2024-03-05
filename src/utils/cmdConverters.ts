export const cmdToTranslation = (cmd: string): string => {
    try {
        const [dlc, descriptor] = cmd.split("::")
        return `${dlc}:${descriptor.replace(":", ".")}`
    }
    catch (e: any) {
        if (!(e instanceof TypeError)) {
            console.error(e)
        }
        return cmd
    }
}
