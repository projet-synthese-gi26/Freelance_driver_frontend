export interface User {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    avatarUrl?: string;
    biography?: string;
    languages?: string[];
}

export interface Vehicle {
    id: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
}

export interface Planning {
    id: string;
    title: string;
    departure: string;
    destination: string;
    startDate: string;
    cost: number;
}

export interface Review {
    id: string;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export interface Driver {
    id: string;
    user: User;
    averageRating?: number;
    totalTrips?: number;
    vehicles?: Vehicle[];
    plannings?: Planning[];
    reviews?: Review[];
    portfolio?: PortfolioItem[];
}
