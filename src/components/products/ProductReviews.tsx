// src/components/products/ProductReviews.tsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Avatar,
    Button,
    TextField,
    Paper,
    Rating,
    Grid,
    Alert
} from '@mui/material';
import { ReviewDto } from '../../types/review';
import { useAppSelector } from '../../hooks/reduxHooks';
import { formatDate } from '../../utils/formatters';

interface ProductReviewsProps {
    productId: number;
    reviews: ReviewDto[];
    onAddReview?: (rating: number, comment: string) => Promise<void>;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
                                                           productId,
                                                           reviews,
                                                           onAddReview
                                                       }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        if (!rating) {
            setError('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        if (onAddReview) {
            try {
                setSubmitting(true);
                setError(null);
                await onAddReview(rating, comment);
                setSuccess('Your review has been submitted successfully!');
                setRating(0);
                setComment('');
            } catch (err) {
                setError('Failed to submit review. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Customer Reviews
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating value={averageRating} precision={0.5} readOnly size="large" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                    {averageRating.toFixed(1)} out of 5
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {isAuthenticated && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Write a Review
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box sx={{ mb: 2 }}>
                        <Typography component="legend">Your Rating</Typography>
                        <Rating
                            name="product-rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            size="large"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Your Review"
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitReview}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </Paper>
            )}

            {reviews.length > 0 ? (
                <Box>
                    {reviews.map((review) => (
                        <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {review.userName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {review.userName}
                                    </Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {formatDate(review.createdAt)}
                                    </Typography>
                                    <Typography variant="body1">{review.comment}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No reviews yet. Be the first to review this product!
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default ProductReviews;