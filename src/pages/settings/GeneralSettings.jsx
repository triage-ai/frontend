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
	Radio,
	RadioGroup,
	Select,
	Stack,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import { CustomTextField } from '../../components/sidebar-items';
import { handleSave } from './SettingsMenus';
import { CustomFilledInput } from '../../components/custom-input';
import { ChevronDown } from 'lucide-react';
import { CircularButton } from '../../components/sidebar';

export const StyledSelect = styled(props => (
	<Select
		{...props}
		IconComponent={props => (
			<ChevronDown
				{...props}
				size={17}
				color="#1B1D1F"
			/>
		)}
		renderValue={item => (
			<Typography
				variant="subtitle1"
				sx={{ fontWeight: 500 }}
			>
				{item}
			</Typography>
		)}
	/>
))({
	'.MuiOutlinedInput-notchedOutline': {
		borderRadius: '12px',
		borderColor: '#E5EFE9',
	},
	'&:hover': {
		'&& fieldset': {
			borderColor: '#22874E',
		},
	},
});

export const GeneralSettings = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		helpdesk_status: settingsData.helpdesk_status.value,
		helpdesk_url: settingsData.helpdesk_url.value || '',
		helpdesk_name: settingsData.helpdesk_name.value || '',
		default_department: settingsData.default_department.value,
		force_http: settingsData.force_http.value,
		collision_avoidance_duration: settingsData.collision_avoidance_duration.value || '',
		default_page_size: settingsData.default_page_size.value,
		default_log_level: settingsData.default_log_level.value,
		purge_logs: settingsData.purge_logs.value,
		show_avatars: settingsData.show_avatars.value || '',
		enable_rich_text: settingsData.enable_rich_text.value || '',
		allow_system_iframe: settingsData.allow_system_iframe.value || '',
		embedded_domain_whitelist: settingsData.embedded_domain_whitelist.value || '',
		acl: settingsData.acl.value || '',
	});

	const handleChange = entry => {
		console.log(formState);
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
				Help Desk Status
			</Typography>

			<Stack
				direction="row"
				spacing={2}
				alignItems="center"
			>
				<RadioGroup
					row
					value={formState.helpdesk_status}
					onChange={handleChange}
					name="helpdesk_status"
				>
					<FormControlLabel
						value="online"
						control={<Radio />}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Online
							</Typography>
						}
					/>

					<FormControlLabel
						value="offline"
						control={<Radio />}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Offline
							</Typography>
						}
					/>
				</RadioGroup>
			</Stack>

			<Stack
				spacing={2}
				sx={{ mt: 1 }}
			>
				<CustomFilledInput
					label="Helpdesk URL"
					name="helpdesk_url"
					value={formState.helpdesk_url}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="Helpdesk Name/Title"
					name="helpdesk_name"
					value={formState.helpdesk_name}
					onChange={handleChange}
				/>
			</Stack>

			<Stack>
				<FormControl>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
					>
						Default Department
					</Typography>

					<StyledSelect
						name="default_department"
						value={formState.default_department}
						onChange={handleChange}
					>
						<MenuItem value="Support">Support</MenuItem>
						<MenuItem value="Sales">Sales</MenuItem>
						<MenuItem value="HR">HR</MenuItem>
					</StyledSelect>
				</FormControl>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Force HTTP
				</Typography>

				<FormControlLabel
					name="force_http"
					control={
						<Checkbox
							checked={formState.force_http === 'on' ? true : false}
							onChange={handleCheckBox}
						/>
					}
					label={
						<Typography
							variant="subtitle1"
							sx={{ fontWeight: 500 }}
						>
							Force all requests through HTTPS
						</Typography>
					}
				/>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Collision Avoidance Duration
				</Typography>

				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
				>
					<CustomTextField
						type="number"
						name="collision_avoidance_duration"
						value={formState.collision_avoidance_duration}
						onChange={handleChange}
						sx={{
							width: 80,
							'& .MuiInputBase-root': {
								borderWidth: 1,
								fontWeight: 500,
							},
						}}
					/>
					<Typography variant="subtitle1">minutes</Typography>
				</Stack>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Default Page Size
				</Typography>

				<FormControl>
					<StyledSelect
						name="default_page_size"
						value={formState.default_page_size}
						onChange={handleChange}
						sx={{ width: 80 }}
					>
						<MenuItem value="5">5</MenuItem>
						<MenuItem value="10">10</MenuItem>
						<MenuItem value="15">15</MenuItem>
						<MenuItem value="20">20</MenuItem>
						<MenuItem value="25">25</MenuItem>
						<MenuItem value="30">30</MenuItem>
						<MenuItem value="35">35</MenuItem>
						<MenuItem value="40">40</MenuItem>
						<MenuItem value="45">45</MenuItem>
						<MenuItem value="50">50</MenuItem>
					</StyledSelect>
				</FormControl>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Default Log Level
				</Typography>

				<FormControl>
					<StyledSelect
						name="default_log_level"
						value={formState.default_log_level}
						onChange={handleChange}
					>
						<MenuItem value="DEBUG">DEBUG</MenuItem>
						<MenuItem value="WARN">WARN</MenuItem>
						<MenuItem value="ERROR">ERROR</MenuItem>
					</StyledSelect>
				</FormControl>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Purge Logs
				</Typography>

				<FormControl>
					<StyledSelect
						name="purge_logs"
						value={formState.purge_logs}
						onChange={handleChange}
					>
						<MenuItem value="0">Never Purge Logs</MenuItem>
						<MenuItem value="1">After 1 month</MenuItem>
						<MenuItem value="2">After 2 months</MenuItem>
						<MenuItem value="3">After 3 months</MenuItem>
						<MenuItem value="4">After 4 months</MenuItem>
						<MenuItem value="5">After 5 months</MenuItem>
						<MenuItem value="6">After 6 months</MenuItem>
						<MenuItem value="7">After 7 months</MenuItem>
						<MenuItem value="8">After 8 months</MenuItem>
						<MenuItem value="9">After 9 months</MenuItem>
						<MenuItem value="10">After 10 months</MenuItem>
						<MenuItem value="11">After 11 months</MenuItem>
						<MenuItem value="12">After 12 months</MenuItem>
					</StyledSelect>
				</FormControl>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Show Avatars
				</Typography>

				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
				>
					<FormControlLabel
						name="show_avatars"
						control={
							<Checkbox
								checked={formState.show_avatars === 'on' ? true : false}
								onChange={handleCheckBox}
							/>
						}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Show avatars on thread view
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
				>
					Enable Rich Text
				</Typography>

				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
				>
					<FormControlLabel
						name="enable_rich_text"
						control={
							<Checkbox
								checked={formState.enable_rich_text === 'on' ? true : false}
								onChange={handleCheckBox}
							/>
						}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Enable html in thread entries and email correspondence
							</Typography>
						}
					/>
				</Stack>
			</Stack>

			<Stack
				mt={3}
				spacing={2}
			>
				<CustomFilledInput
					label="Allow System iFrame"
					name="allow_system_iframe"
					value={formState.allow_system_iframe}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="Embedded Domain Whitelist"
					name="embedded_domain_whitelist"
					value={formState.embedded_domain_whitelist}
					onChange={handleChange}
				/>

				<CustomFilledInput
					label="ACL"
					name="acl"
					value={formState.acl}
					onChange={handleChange}
				/>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
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
			</Stack>
		</Box>
	);
};
