// src/components/products/ProductFilters.tsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Slider,
    TextField,
    Button,
    Divider,
    Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CategoryDto } from '../../types/category';

interface PriceRange {
    min: number;
    max: number;
}

interface ProductFiltersProps {
    categories: CategoryDto[];
    priceRange: PriceRange;
    onFilterChange: (filters: {
        categories: number[];
        priceRange: PriceRange;
        inStock: boolean;
    }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
                                                           categories,
                                                           priceRange,
                                                           onFilterChange
                                                       }) => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [currentPriceRange, setCurrentPriceRange] = useState<PriceRange>(priceRange);
    const [inStock, setInStock] = useState(false);
    const [expanded, setExpanded] = useState<string | false>('categories');

    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCategoryChange = (categoryId: number) => {
        const newSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(newSelectedCategories);
        applyFilters(newSelectedCategories, currentPriceRange, inStock);
    };

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            const newPriceRange = {
                min: newValue[0],
                max: newValue[1]
            };
            setCurrentPriceRange(newPriceRange);
        }
    };

    const handlePriceInputChange = (type: 'min' | 'max') => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(event.target.value);
        if (!isNaN(value)) {
            setCurrentPriceRange({
                ...currentPriceRange,
                [type]: value
            });
        }
    };

    const handleInStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setInStock(checked);
        applyFilters(selectedCategories, currentPriceRange, checked);
    };

    const applyFilters = (
        categories: number[],
        priceRange: PriceRange,
        inStock: boolean
    ) => {
        onFilterChange({
            categories,
            priceRange,
            inStock
        });
    };

    const handleApplyPriceFilter = () => {
        applyFilters(selectedCategories, currentPriceRange, inStock);
    };

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setCurrentPriceRange(priceRange);
        setInStock(false);
        onFilterChange({
            categories: [],
            priceRange,
            inStock: false
        });
    };

    return (
        <Paper elevation={0} sx={{ p: 2, mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
                Filters
            </Typography>

            <Accordion
                expanded={expanded === 'categories'}
                onChange={handleAccordionChange('categories')}
                elevation={0}
                disableGutters
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {categories.map(category => (
                            <FormControlLabel
                                key={category.id}
                                control={
                                    <Checkbox
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                }
                                label={category.name}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 1 }} />

            <Accordion
                expanded={expanded === 'price'}
                onChange={handleAccordionChange('price')}
                elevation={0}
                disableGutters
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Price Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Slider
                        value={[currentPriceRange.min, currentPriceRange.max]}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={priceRange.min}
                        max={priceRange.max}
                        sx={{ mt: 3, mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <TextField
                            label="Min"
                            size="small"
                            value={currentPriceRange.min}
                            onChange={handlePriceInputChange('min')}
                            type="number"
                            InputProps={{ inputProps: { min: priceRange.min } }}
                            sx={{ width: '45%' }}
                        />
                        <TextField
                            label="Max"
                            size="small"
                            value={currentPriceRange.max}
                            onChange={handlePriceInputChange('max')}
                            type="number"
                            InputProps={{ inputProps: { max: priceRange.max } }}
                            sx={{ width: '45%' }}
                        />
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleApplyPriceFilter}
                        fullWidth
                    >
                        Apply Price Filter
                    </Button>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={inStock}
                        onChange={handleInStockChange}
                    />
                }
                label="In Stock Only"
            />

            <Divider sx={{ my: 1 }} />

            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleResetFilters}
                fullWidth
                sx={{ mt: 2 }}
            >
                Reset All Filters
            </Button>
        </Paper>
    );
};

export default ProductFilters;