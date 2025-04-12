// src/types/review.ts
export interface ReviewDto {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface CreateReviewDto {
    productId: number;
    rating: number;
    comment: string;
}