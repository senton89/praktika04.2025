// src/components/products/ProductPrice.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProductPriceProps {
    price: number;
    originalPrice?: number;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
                                                       price,
                                                       originalPrice,
                                                       size = 'medium',
                                                       color = 'primary'
                                                   }) => {
    const hasDiscount = originalPrice && originalPrice > price;

    const getFontSize = () => {
        switch (size) {
            case 'small':
                return { current: '0.875rem', original: '0.75rem' };
            case 'large':
                return { current: '1.5rem', original: '1rem' };
            default:
                return { current: '1.25rem', original: '0.875rem' };
        }
    };

    const fontSize = getFontSize();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
                variant="body1"
                color={color}
                fontWeight="bold"
                sx={{ fontSize: fontSize.current }}
            >
                ${price.toFixed(2)}
            </Typography>

            {hasDiscount && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        textDecoration: 'line-through',
                        ml: 1,
                        fontSize: fontSize.original
                    }}
                >
                    ${originalPrice.toFixed(2)}
                </Typography>
            )}

            {hasDiscount && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        ml: 1,
                        fontSize: fontSize.original,
                        fontWeight: 'medium'
                    }}
                >
                    {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                </Typography>
            )}
        </Box>
    );
};

export default ProductPrice;