// src/components/products/ProductRating.tsx
import React from 'react';
import { Box, Typography, Rating } from '@mui/material';

interface ProductRatingProps {
    value: number;
    count: number;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
    readOnly?: boolean;
    onChange?: (newValue: number | null) => void;
}

const ProductRating: React.FC<ProductRatingProps> = ({
                                                         value,
                                                         count,
                                                         size = 'small',
                                                         showCount = true,
                                                         readOnly = true,
                                                         onChange
                                                     }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
                value={value}
                precision={0.5}
                size={size}
                readOnly={readOnly}
                onChange={(event, newValue) => {
                    if (onChange) {
                        onChange(newValue);
                    }
                }}
            />
            {showCount && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({count} {count === 1 ? 'review' : 'reviews'})
                </Typography>
            )}
        </Box>
    );
};

export default ProductRating;