// src/components/categories/CategoryGrid.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button
} from '@mui/material';
import { CategoryDto } from '../../types/category';

interface CategoryGridProps {
    categories: CategoryDto[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
    // Placeholder images for categories
    const getCategoryImage = (index: number) => {
        const images = [
            'https://via.placeholder.com/300x200?text=Electronics',
            'https://via.placeholder.com/300x200?text=Clothing',
            'https://via.placeholder.com/300x200?text=Home',
            'https://via.placeholder.com/300x200?text=Books',
            'https://via.placeholder.com/300x200?text=Sports',
            'https://via.placeholder.com/300x200?text=Beauty'
        ];
        return images[index % images.length];
    };

    return (
        <Grid container spacing={3}>
            {categories.map((category, index) => (
                <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}> {/*TODO: test*/}
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                            }
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image={getCategoryImage(index)}
                            alt={category.name}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography gutterBottom variant="h6" component="div">
                                {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {category.description || 'Explore our collection of ' + category.name}
                            </Typography>
                            <Box sx={{ mt: 'auto' }}>
                                <Button
                                    component={RouterLink}
                                    to={`/categories/${category.id}`}
                                    variant="outlined"
                                    fullWidth
                                >
                                    Browse {category.name}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CategoryGrid;