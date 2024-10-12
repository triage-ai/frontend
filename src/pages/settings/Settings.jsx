import {
	Box,
	Dialog,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	inputLabelClasses,
	styled,
} from '@mui/material';
import {
	Settings2,
} from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useContext, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import { useLocation } from 'react-router-dom';



export const Settings = ({ Menu }) => {
	const { settings, refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		refreshSettings();
	}, [])

	console.log(settings)

	return (
    <Layout
        title={'Settings'}
        subtitle={'Edit your settings'}
        buttonInfo={{
            label: 'Edit settings',
            icon: <Settings2 size={20} />,
        }}
    >
        <WhiteContainer noPadding>
			{ Object.keys(settings).length === 0 ? <p>loading...</p> :  <Menu settingsData = { settings } />}
        </WhiteContainer>
    </Layout>
    );
};
