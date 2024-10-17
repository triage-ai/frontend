import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import {
	Box,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	MenuItem,
	Typography,
} from '@mui/material';
import { handleSave } from './SettingsMenus';
import { StyledSelect } from './SettingsMenus';
import { CircularButton } from '../../components/sidebar';

export const Attachments = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		store_attachments: settingsData.store_attachments.value,
		agent_max_file_size: settingsData.agent_max_file_size.value,
		login_required: settingsData.login_required.value,
	});

	const handleChange = entry => {
		console.log(entry);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const handleCheckBox = event => {
		console.log(event);

		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);
	};

	return (
		<Box
			p={3}
			maxWidth={600}
		>
			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mb: 1.5 }}
			>
				Store Attachments
			</Typography>

			<FormControl>
				<StyledSelect
					name="store_attachments"
					value={formState.store_attachments}
					onChange={handleChange}
				>
					<MenuItem value="Database">Database</MenuItem>
				</StyledSelect>
			</FormControl>

			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
			>
				Agent Maximum File Size
			</Typography>

			<FormControl>
				<StyledSelect
					name="agent_max_file_size"
					value={formState.agent_max_file_size}
					onChange={handleChange}
				>
					<MenuItem value="512 kb">512 kb</MenuItem>
					<MenuItem value="1 mb">1 mb</MenuItem>
					<MenuItem value="2 mb">2 mb</MenuItem>
				</StyledSelect>
			</FormControl>

			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
			>
				Login Required
			</Typography>

			<FormControlLabel
				name="login_required"
				control={
					<Checkbox
						checked={formState.login_required === 'on' ? true : false}
						onChange={handleCheckBox}
					/>
				}
				label={
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 500 }}
					>
						Require login to view any attachments
					</Typography>
				}
			/>

			<CircularButton
				sx={{ py: 2, px: 6, mt: 3, width: 250 }}
				onClick={() =>
					handleSave(
						formState,
						setLoading,
						setCircleLoading,
						settingsData,
						updateSettings,
						refreshSettings
					)
				}
				disabled={loading || circleLoading}
			>
				{circleLoading ? (
					<CircularProgress
						size={22}
						thickness={5}
						sx={{ color: '#FFF' }}
					/>
				) : (
					'Save Changes'
				)}
			</CircularButton>
		</Box>
	);
};
