// src/components/layout/Footer.tsx (продолжение)
import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4}}> {/*TODO: test*/}
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We are an e-commerce platform dedicated to providing quality products at affordable prices.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4}}> {/*TODO: test*/}
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: info@ecommerceapp.com
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone: +1 234 567 8901
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4}}> {/*TODO: test*/}
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Follow Us
                        </Typography>
                        <Link href="#" color="inherit" sx={{ mr: 2 }}>
                            Facebook
                        </Link>
                        <Link href="#" color="inherit" sx={{ mr: 2 }}>
                            Twitter
                        </Link>
                        <Link href="#" color="inherit">
                            Instagram
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="/">
                            ECommerce App
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;