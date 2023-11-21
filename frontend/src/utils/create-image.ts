export interface Image {
    prefix: string;
    originalData: string;
    currentData: string;
    filter: string | null;
    isUnchanged: boolean;
}

export const createImage = (image: string): Image => {
    const [prefix, originalData] = image.split(',');
    return {
        prefix,
        originalData,
        currentData: originalData,
        filter: null,
        isUnchanged: true
    };
};
