export interface Announcement {
    id: number;
    category: string;
    title: string;
    date: string;
    views: number;
}

export interface AnnouncementDetail extends Announcement {
    content: string;
}