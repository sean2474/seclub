export interface SiteData {
    id: string;
    title: string;
    features: string[];
    imageQuery: string;
    disallowed?: string[];
    allowed?: string[];
    image: string;
}