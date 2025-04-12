// src/components/common/Pagination.tsx
import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

interface PaginationProps {
    count: number;
    page: number;
    onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ count, page, onChange }) => {
    if (count <= 1) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <MuiPagination
                count={count}
                page={page}
                onChange={onChange}
                color="primary"
                showFirstButton
                showLastButton
            />
        </Box>
    );
};

export default Pagination;