// src/components/products/ProductCard.tsx (обновленный)
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from '@mui/material';
import { ProductDto } from '../../types/product';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addToCart } from '../../store/slices/cartSlice';
import ProductRating from './ProductRating';
import ProductPrice from './ProductPrice';

interface ProductCardProps {
    product: ProductDto;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity: 1 }));
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={"./images/" + product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component={RouterLink}
                    to={`/products/${product.id}`}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                    {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.categoryName}
                </Typography>

                <Box sx={{ mb: 1 }}>
                    <ProductRating value={4} count={24} />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {product.description}
                </Typography>

                <ProductPrice price={product.price} />
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity <= 0}
                >
                    {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;