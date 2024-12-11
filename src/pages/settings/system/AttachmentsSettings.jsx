import {
	Box,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	MenuItem,
	Typography,
	Stack,
	Dialog,
	Button,
	IconButton,
} from '@mui/material';
import { useState } from 'react';
import { CircularButton } from '../../../components/sidebar';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { handleSave, StyledSelect } from '../SettingsMenus';
import { SquareArrowOutUpRight, X } from 'lucide-react';
import { WhiteContainer } from '../../../components/white-container';
import { CustomFilledInput } from '../../../components/custom-input';
import { CustomSelect } from '../../../components/custom-select';

export const Attachments = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [openConfig, setOpenConfig] = useState(false);
	const [editKey, setEditKey] = useState(false);
	const [formState, setFormState] = useState({
		store_attachments: settingsData.store_attachments.value,
		agent_max_file_size: settingsData.agent_max_file_size.value,
		login_required: settingsData.login_required.value,
		s3_bucket_name: settingsData.s3_bucket_name.value,
		s3_bucket_region: settingsData.s3_bucket_region.value,
		s3_access_key: settingsData.s3_access_key.value,
		s3_secret_access_key: settingsData.s3_secret_access_key.value
	});

	const handleChange = event => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});

		setLoading(false);
	};

	const handleKeyChange = event => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});

		setEditKey(true)
		setLoading(false);
	}

	const handleCheckBox = event => {

		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);
		
	};

	const handleDialogClose = () => {
		setOpenConfig(false);
		console.log(formState)
	}

	const handleDialogOpen = (event) => {
		event.stopPropagation();

		setOpenConfig(true);
	}

	const maskValue = (text) => {
		if (!text || text.length <= 4) return text; // Return as is if text is too short
		return "•".repeat(text.length - 4) + text.slice(-4);
	  };

	const sizeOptions = [{'label': '512 kb', 'value': '512000'}, {'label': '1 mb', 'value': '1000000'}, {'label': '2 mb', 'value': '2000000'}]

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
			
			<Stack direction='row' spacing={2} alignItems='center'>
				<FormControl>
					<StyledSelect
						name="store_attachments"
						value={formState.store_attachments}
						onChange={handleChange}
					>
						<MenuItem value="S3">S3</MenuItem>
					</StyledSelect>
				</FormControl>

				{formState.store_attachments ==='S3' && (
					<Button variant='contained' size="small" sx={{height: '50%', textTransform: 'none'}} onClick={event => handleDialogOpen(event)}>
						<SquareArrowOutUpRight size={12}/>
						<Typography variant='subtitle1' paddingLeft={0.5}>Configure</Typography>
					</Button>
				)}
			</Stack>



			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
			>
				Agent Maximum File Size
			</Typography>

			<FormControl>
				<CustomSelect label={'Agent Max Upload Size'} onChange={handleChange} value={formState.agent_max_file_size} name={"agent_max_file_size"} mb={2} options={sizeOptions} sx={{width: 200}}/>
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
					{handleSave(
						formState,
						setLoading,
						setCircleLoading,
						settingsData,
						updateSettings,
						refreshSettings
					)
					setEditKey(false)
					}
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

			<Dialog
				open={openConfig}
				onClose={handleDialogClose}
				PaperProps={{
					sx: {
						maxWidth: '850px',
						background: '#f1f4f2',
						py: 2,
						px: 3,
						m: 2,
						borderRadius: '10px',
					},
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Box
						sx={{
							width: '100%',
							textAlign: 'right',
							// pb: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ width: '40px', height: '40px' }} />

						<IconButton
							aria-label="close dialog"
							onClick={handleDialogClose}
							sx={{
								width: '40px',
								height: '40px',
								color: '#545555',
								transition: 'all 0.2s',
								'&:hover': {
									color: '#000',
								},
							}}
						>
							<X size={20} />
						</IconButton>


					</Box>
						<WhiteContainer noPadding>
							<Box sx={{ padding: 2 }}> 
								<Typography variant='h2' paddingBottom={10}>Configure your S3 Credentials</Typography>
								
									<Stack spacing={2}>
										<Stack direction='row' spacing={2} alignItems='center'>
											<Typography variant='subtitle1' pr={10.4}>
												S3 Bucket Name:
											</Typography>
											<CustomFilledInput label='S3 Bucket Name' name='s3_bucket_name' value={formState.s3_bucket_name} sx={{ width: 430 }} onChange={handleChange} />

										</Stack>

										<Stack direction='row' spacing={2} alignItems='center'>
											<Typography variant='subtitle1' pr={8.2}>
												S3 Bucket Location:
											</Typography>
											<CustomFilledInput label='S3 Bucket Location' name='s3_bucket_region' value={formState.s3_bucket_region} sx={{ width: 430 }} onChange={handleChange} />
										</Stack>

										<Stack direction='row' spacing={2} alignItems='center'>
											<Typography variant='subtitle1' pr={6.1}>
												S3 Bucket Access Key:
											</Typography>
											<CustomFilledInput label='S3 Bucket Access Key' name='s3_access_key' value={editKey ? formState.s3_access_key : maskValue(formState.s3_access_key)} sx={{ width: 430 }} onChange={handleKeyChange} />
										</Stack>

										<Stack direction='row' spacing={2} alignItems='center'>
											<Typography variant='subtitle1'>
												S3 Bucket Secret Access Key:
											</Typography>
											<CustomFilledInput label='S3 Bucket Secret Access Key' name='s3_secret_access_key' value={editKey ? formState.s3_secret_access_key : maskValue(formState.s3_secret_access_key)} sx={{ width: 430 }} onChange={handleKeyChange} />
										</Stack>
									</Stack>
								

							</Box>
						</WhiteContainer>

					
				</Box>

			</Dialog>
		</Box>
	);
};
