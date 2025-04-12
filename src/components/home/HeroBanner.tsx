// src/components/home/HeroBanner.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

interface HeroBannerProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
                                                   title,
                                                   subtitle,
                                                   ctaText,
                                                   ctaLink,
                                                   backgroundImage = 'https://source.unsplash.com/random/1600x900/?shopping'
                                               }) => {
    return (
        <Paper
            sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${backgroundImage})`,
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            {/* Increase the priority of the hero background image */}
            {<img style={{ display: 'none' }} src={backgroundImage} alt="banner" />}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,.4)'
                }}
            />
            <Box
                sx={{
                    position: 'relative',
                    p: { xs: 3, md: 6 },
                    pr: { md: 0 },
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                    {subtitle}
                </Typography>
                <Button
                    component={RouterLink}
                    to={ctaLink}
                    variant="contained"
                    size="large"
                    sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                    {ctaText}
                </Button>
            </Box>
        </Paper>
    );
};

export default HeroBanner;