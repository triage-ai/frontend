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

	const handleCheckBox = event => {

		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);

	};

	const sizeOptions = [{ label: '512 kb', value: '512000' }, { label: '1 mb', value: '1000000' }, { label: '2 mb', value: '2000000' }]
	const storageOptions = [{ label: 'AWS S3', value: 's3' }]
	const customStorageOptions = {
		's3': [
			{ label: 'S3 Bucket Name', name: 's3_bucket_name' },
			{ label: 'S3 Bucket Region', name: 's3_bucket_region' },
			{ label: 'S3 Bucket Access Key', name: 's3_access_key', type: 'hidden' },
			{ label: 'S3 Bucket Secret Access Key', name: 's3_secret_access_key', type: 'hidden' }
		]
	}

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

			<CustomSelect
				label={'Storage Backend'}
				onChange={handleChange}
				value={formState.store_attachments}
				name="store_attachments"
				options={storageOptions}
				sx={{ width: '200px', mb: 2 }}
			/>

			<Stack>
				{
					customStorageOptions[formState.store_attachments]?.map((field) => (
						field.type === 'hidden' ?
						<HiddenInput key={field.name} label={field.label} name={field.name} value={formState[field.name]} sx={{ width: 400, mb: 2 }} onChange={handleChange} />
						:
						<CustomFilledInput key={field.name} label={field.label} name={field.name} value={formState[field.name]} sx={{ width: 400, mb: 2 }} onChange={handleChange} />
					))
				}
			</Stack>


			<Typography
				variant="h4"
				sx={{ fontWeight: 600, mt: 1, mb: 1.5 }}
			>
				Agent Maximum File Size
			</Typography>

			<FormControl>
				<CustomSelect
					hideLabel
					label={'Agent Max Upload Size'}
					onChange={handleChange}
					value={formState.agent_max_file_size}
					name={"agent_max_file_size"}
					mb={2}
					options={sizeOptions}
					sx={{ width: 200 }}
				/>
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
				onClick={() => {
					handleSave(
						formState,
						setLoading,
						setCircleLoading,
						settingsData,
						updateSettings,
						refreshSettings
					)
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

		</Box>
	);
};

const HiddenInput = ({
	label,
	name,
	value,
	onChange,
	...props
}) => {
	const { ...otherProps } = props

	const [editMode, setEditMode] = useState(false)
	
	const maskValue = (text) => {
		if (!text || text.length <= 4) return text;
		return "•".repeat(text.length - 4) + text.slice(-4);
	};
	
	const onEditChange = (e) => {
		if (!editMode) {
			setEditMode(true)
			e.target.value = ''
		}
		onChange(e)
	}

	return (
		<CustomFilledInput label={label} name={name} value={editMode ? value : maskValue(value)} onChange={onEditChange} {...otherProps} />
	)
}
