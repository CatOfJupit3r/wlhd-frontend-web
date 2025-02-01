export const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    if (string.length === 1) return string.toUpperCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};
