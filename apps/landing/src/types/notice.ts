export interface Notice {
    id: string;
    category: string;
    title: string;
    created_at: string;
    view: number;
}

export interface NoticeDetail extends Notice {
    content: string;
    images?: string[];
}