import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import { handleSave } from './SettingsMenus';
import { StyledSelect } from './GeneralSettings';
import { CircularButton } from '../../components/sidebar';

export const Autoresponder = props => {
    return (
        <p>Autoresponder</p>
    )
}