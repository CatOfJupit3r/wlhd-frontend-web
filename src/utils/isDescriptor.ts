export const isDescriptor = (descriptor: unknown): boolean => {
    return (
        !!descriptor &&
        typeof descriptor === 'string' &&
        descriptor.length > 0 &&
        /^[a-zA-Z]+:[a-zA-Z._-]+$/gm.test(descriptor)
    )
}
