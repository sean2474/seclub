export interface Notice {
    id: number;
    category: string;
    title: string;
    date: string;
    views: number;
}

export interface NoticeDetail extends Notice {
    content: string;
    images?: string[];
}