export interface Image {
    id: string;
    url: string;
    hasBeenProcessed: boolean;
    appliedFilter: string | null;
}
