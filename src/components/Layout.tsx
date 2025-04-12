// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
                        ECommerce App
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Box sx={{ my: 4 }}>
                    {children}
                </Box>
            </Container>
        </>
    );
};

export default Layout;