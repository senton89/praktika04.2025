// src/components/cart/CartItem.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Grid, Divider } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { CartItem as CartItemType } from '../../store/slices/cartSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

interface CartItemProps {
    item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { product, quantity } = item;
    const dispatch = useAppDispatch();
    const [itemQuantity, setItemQuantity] = useState(quantity);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0 && newQuantity <= product.stockQuantity) {
            setItemQuantity(newQuantity);
            dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(product.id));
    };

    return (
        <Box sx={{ py: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 2}}> {/*TODO: test*/}
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 80,
                            objectFit: 'contain',
                        }}
                        src={product.imageUrl || 'https://via.placeholder.com/80'}
                        alt={product.name}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4}}> {/*TODO: test*/}
                    <Typography
                        variant="subtitle1"
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.categoryName}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2}}> {/*TODO: test*/}
                    <Typography variant="body1" fontWeight="medium">
                        ${product.price.toFixed(2)}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 2}}> {/*TODO: test*/}
                    <TextField
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: 1, max: product.stockQuantity } }}
                        value={itemQuantity}
                        onChange={handleQuantityChange}
                        sx={{ width: 70 }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 1}}> {/*TODO: test*/}
                    <Typography variant="body1" fontWeight="medium">
                        ${(product.price * quantity).toFixed(2)}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 1}} sx={{ textAlign: 'right' }}> {/*TODO: test*/}
                    <IconButton color="error" onClick={handleRemove}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
};

export default CartItem;