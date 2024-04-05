import React, { useState } from 'react';
import { Sidebar } from '../../components/sidebar';
import { Box, styled } from '@mui/material';

const DrawerHeader = styled('div')(({ theme }) => ({
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const DrawerContentContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	height: '100vh',
	background: '#F4F4F4',
}));

export const Home = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<h1>Hello World</h1>
		</Box>
	);
};
