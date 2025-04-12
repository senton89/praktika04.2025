// src/pages/ProductDetailPage.tsx (обновленный)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Divider, Tabs, Tab } from '@mui/material';
import { useAppDispatch } from '../hooks/reduxHooks';
import { showNotification } from '../store/slices/uiSlice';
import productService from '../services/productService';
import { ProductDto } from '../types/product';
import { ReviewDto } from '../types/review';
import ProductDetail from '../components/products/ProductDetail';
import ProductReviews from '../components/products/ProductReviews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import RecommendedProducts from '../components/products/RecommendedProducts';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const [product, setProduct] = useState<ProductDto | null>(null);
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [recommendedProducts, setRecommendedProducts] = useState<ProductDto[]>([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await productService.getProductById(Number(id));
                setProduct(response.data.data);

                //TODO: Fetch reviews (this would be a separate API call in a real app)
                // For now, we'll use mock data
                setReviews([
                    {
                        id: 1,
                        productId: Number(id),
                        userId: 1,
                        userName: 'John Doe',
                        rating: 5,
                        comment: 'Great product! Exactly as described and arrived quickly.',
                        createdAt: '2023-05-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        productId: Number(id),
                        userId: 2,
                        userName: 'Jane Smith',
                        rating: 4,
                        comment: 'Good quality for the price. Would recommend.',
                        createdAt: '2023-05-10T14:20:00Z'
                    }
                ]);
                setRecommendedProducts([
                    {
                        id: 101,
                        name: 'Related Product 1',
                        description: 'This is a related product that customers often buy together.',
                        price: 49.99,
                        stockQuantity: 15,
                        imageUrl: 'https://via.placeholder.com/200',
                        categoryId: product!.categoryId,
                        categoryName: product!.categoryName
                    },
                    {
                        id: 102,
                        name: 'Related Product 2',
                        description: 'Another popular item in this category.',
                        price: 39.99,
                        stockQuantity: 8,
                        imageUrl: 'https://via.placeholder.com/200',
                        categoryId: product!.categoryId,
                        categoryName: product!.categoryName
                    },
                    {
                        id: 103,
                        name: 'Related Product 3',
                        description: 'Customers who viewed this item also viewed this product.',
                        price: 59.99,
                        stockQuantity: 12,
                        imageUrl: 'https://via.placeholder.com/200',
                        categoryId: product!.categoryId,
                        categoryName: product!.categoryName
                    },
                    {
                        id: 104,
                        name: 'Related Product 4',
                        description: 'A complementary product to enhance your purchase.',
                        price: 29.99,
                        stockQuantity: 20,
                        imageUrl: 'https://via.placeholder.com/200',
                        categoryId: product!.categoryId,
                        categoryName: product!.categoryName
                    }
                ]);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAddReview = async (rating: number, comment: string) => {
        // In a real app, this would call an API to add the review
        // For now, we'll just simulate it
        const newReview: ReviewDto = {
            id: reviews.length + 1,
            productId: Number(id),
            userId: 3, // This would come from the authenticated user
            userName: 'Current User', // This would come from the authenticated user
            rating,
            comment,
            createdAt: new Date().toISOString()
        };

        setReviews([newReview, ...reviews]);

        dispatch(showNotification({
            message: 'Your review has been submitted successfully!',
            severity: 'success'
        }));
    };

    if (loading) {
        return <LoadingSpinner fullPage message="Loading product details..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    if (!product) {
        return <ErrorDisplay error="Product not found" />;
    }

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {product.name}
                </Typography>

                <ProductDetail product={product} />

                <Box sx={{ mt: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="product tabs"
                        >
                            <Tab label="Description" id="product-tab-0" />
                            <Tab
                                label={`Reviews (${reviews.length})`}
                                id="product-tab-1"
                            />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            Product Description
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {product.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Specifications
                        </Typography>
                        <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                            <Typography component="dt" variant="body2" fontWeight="bold">Category:</Typography>
                            <Typography component="dd" variant="body2">{product.categoryName}</Typography>

                            <Typography component="dt" variant="body2" fontWeight="bold">Stock:</Typography>
                            <Typography component="dd" variant="body2">{product.stockQuantity} units</Typography>

                            <Typography component="dt" variant="body2" fontWeight="bold">Product ID:</Typography>
                            <Typography component="dd" variant="body2">{product.id}</Typography>
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <ProductReviews
                            productId={product.id}
                            reviews={reviews}
                            onAddReview={handleAddReview}
                        />
                    </TabPanel>
                </Box>
            </Box>
            <RecommendedProducts products={recommendedProducts} />
        </Container>
    );
};

export default ProductDetailPage;