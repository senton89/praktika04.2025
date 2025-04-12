// src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { ProductDto } from '../types/product';
import { CategoryDto } from '../types/category';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';

const ProductsPage: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearchTerm = searchParams.get('search') || '';

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [sortOption, setSortOption] = useState('default');

    // Calculate price range from products
    const getPriceRange = () => {
        if (products.length === 0) {
            return { min: 0, max: 1000 };
        }

        const prices = products.map(product => product.price);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch products and categories in parallel
                const [productsResponse, categoriesResponse] = await Promise.all([
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);

                const fetchedProducts = productsResponse.data.data;
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
                setCategories(categoriesResponse.data.data);

                // Apply initial search if provided
                if (initialSearchTerm) {
                    filterProducts(fetchedProducts, initialSearchTerm);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialSearchTerm]);

    const filterProducts = (productsToFilter: ProductDto[], term: string) => {
        if (!term.trim()) {
            return productsToFilter;
        }

        const lowerCaseTerm = term.toLowerCase();
        return productsToFilter.filter(
            product =>
                product.name.toLowerCase().includes(lowerCaseTerm) ||
                product.description.toLowerCase().includes(lowerCaseTerm) ||
                product.categoryName.toLowerCase().includes(lowerCaseTerm)
        );
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        setFilteredProducts(filterProducts(products, term));
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        const option = event.target.value;
        setSortOption(option);

        const sortedProducts = [...filteredProducts];
        switch (option) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sorting (newest first or by id)
                sortedProducts.sort((a, b) => b.id - a.id);
        }

        setFilteredProducts(sortedProducts);
    };

    const handleFilterChange = (filters: {
        categories: number[];
        priceRange: { min: number; max: number };
        inStock: boolean;
    }) => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filterProducts(filtered, searchTerm);
        }

        // Filter by categories
        if (filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                filters.categories.includes(product.categoryId)
            );
        }

        // Filter by price range
        filtered = filtered.filter(
            product =>
                product.price >= filters.priceRange.min &&
                product.price <= filters.priceRange.max
        );

        // Filter by stock
        if (filters.inStock) {
            filtered = filtered.filter(product => product.stockQuantity > 0);
        }

        // Apply current sort
        if (sortOption !== 'default') {
            switch (sortOption) {
                case 'price-asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
        }

        setFilteredProducts(filtered);
    };

    if (loading) {
        return <LoadingSpinner fullPage message="Loading products..." />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Products
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6}}> {/*TODO: test*/}
                        <FormControl fullWidth>
                            <InputLabel id="sort-select-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sortOption}
                                label="Sort By"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="default">Default</MenuItem>
                                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                                <MenuItem value="name-desc">Name: Z to A</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 3}}> {/*TODO: test*/}
                    <ProductFilters
                        categories={categories}
                        priceRange={getPriceRange()}
                        onFilterChange={handleFilterChange}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 9}}> {/*TODO: test*/}
                    <ProductList
                        products={filteredProducts}
                        loading={false}
                        error={null}
                        title={searchTerm ? `Search results for "${searchTerm}"` : undefined}
                        itemsPerPage={9} // Показывать 9 продуктов на странице
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductsPage;